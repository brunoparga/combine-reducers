import combineReducers, { Action, Reducer, SliceReducer } from '.'

describe('Simple states', () => {
  it('Works with an empty state and identity action', () => {
    const appState = {}
    const action = { type: 'identity' }
    expect(combineReducers({})(appState, action)).toStrictEqual({})
  })

  it('Works with a basic state and identity action', () => {
    const appState = { foo: 'bar' }
    const action = { type: 'identity' }
    expect(combineReducers({ foo: (x: any) => x })(appState, action)).toStrictEqual(appState)
  })

  it('Works with a basic state and constant action', () => {
    const appState = { foo: 'bar' }
    const action = { type: 'null' }
    const argument = { foo: () => ({ foo: 'baz' }) }
    expect(combineReducers(argument)(appState, action)).toStrictEqual({ foo: 'baz' })
  })
})

type AppState = { foo: string, quux: string }
const fooReducer: SliceReducer<AppState, 'foo'> =
  (state: AppState, { type }: Action) => {
    switch (type) {
      case 'twodown':
        return { foo: 'baz' }
      case 'garplify':
        return { foo: 'garply' }
      default:
        return { foo: state.foo }
    }
  }

describe('States with two attributes', () => {
  const state: AppState = { foo: 'bar', quux: 'corge' }

  const quuxReducer: SliceReducer<AppState, 'quux'> =
  (state: AppState, { type }: Action): Record<'quux', AppState['quux']> =>
    (type === 'twodown') ? { quux: 'grault' } : { quux: state.quux }

  const reducer: Reducer<any> = combineReducers({ foo: fooReducer, quux: quuxReducer })

  it('Applies the identity action to both properties', () => {
    const newState = reducer(state, { type: 'identity' })
    expect(newState).toStrictEqual(state)
  })

  it('Applies a simple action to both properties', () => {
    const newState = reducer(state, { type: 'twodown' })
    const expectedState = { foo: 'baz', quux: 'grault' }
    expect(newState).toStrictEqual(expectedState)
  })

  it('Applies a simple action to just one of the properties, leaving the other unchanged', () => {
    const newState = reducer(state, { type: 'garplify' })
    const expectedState = { foo: 'garply', quux: 'corge' }
    expect(newState).toStrictEqual(expectedState)
  })
})

describe('States with nested objects', () => {
  type BarType = { quux: number, corge: boolean }
  type DeepAppState = { foo: string, bar: BarType }
  const state: DeepAppState = { foo: 'baz', bar: { quux: 42, corge: false } }

  const idFooReducer: SliceReducer<DeepAppState, 'foo'> = (state) => ({ foo: state.foo })
  const idQuuxReducer: SliceReducer<BarType, 'quux'> = (state) => ({ quux: state.quux })
  const idCorgeReducer: SliceReducer<BarType, 'corge'> = (state) => ({ corge: state.corge })

  it('Works with identity reducers', () => {
    const reducer = combineReducers(
      { foo: idFooReducer, bar: { quux: idQuuxReducer, corge: idCorgeReducer } }
    )
    const newState = reducer(state, { type: 'null' })
    expect(newState).toStrictEqual(state)
  })

  it('Works with only a top-level property changing', () => {
    const reducer = combineReducers(
      { foo: fooReducer, bar: { quux: idQuuxReducer, corge: idCorgeReducer } }
    )
    const newState = reducer(state, { type: 'garplify' })
    const expectedState = { foo: 'garply', bar: { quux: 42, corge: false } }
    expect(newState).toStrictEqual(expectedState)
  })

  it('Works with only a nested-level property changing', () => {
    const corgeReducer: any = (state: DeepAppState, { type }: Action) => {
      if (type === 'toggle') {
        console.log("Yeah I'm definitely here")
        return { ...state, bar: { ...state.bar, corge: !state.bar.corge } }
      }
      return { corge: state.bar.corge }
    }
    const reducer = combineReducers(
      { foo: idFooReducer, bar: { quux: idQuuxReducer, corge: corgeReducer } }
    )
    const newState = reducer(state, { type: 'toggle' })
    const expectedState: DeepAppState = { foo: 'baz', bar: { quux: 42, corge: true } }
    expect(newState).toStrictEqual(expectedState)
  })
  // it('Works with properties on both levels changing')
})
