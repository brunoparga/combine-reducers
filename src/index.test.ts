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

describe('States with two attributes', () => {
  type AppState = { foo: string, quux: string }
  const state: AppState = { foo: 'bar', quux: 'corge' }

  const fooReducer: SliceReducer<AppState, 'foo'> =
  (state: AppState, { type }: Action): Record<'foo', AppState['foo']> => {
    switch (type) {
      case 'twodown':
        return { foo: 'baz' }
      case 'garplify':
        return { foo: 'garply' }
      default:
        return { foo: state.foo }
    }
  }

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
  type BarType = {quux: number, corge: boolean}
  type DeepAppState = {foo: string, bar: BarType}
  const state: DeepAppState = { foo: 'baz', bar: { quux: 42, corge: false } }

  it('Works with identity reducers', () => {
    const idFooReducer:
    SliceReducer<DeepAppState, 'foo'> = (state, action) => ({ foo: state.foo })
    const idQuuxReducer:
    SliceReducer<BarType, 'quux'> = (state, action) => ({ quux: state.quux })
    const idCorgeReducer:
    SliceReducer<BarType, 'corge'> = (state, action) => ({ corge: state.corge })
    const reducer = combineReducers(
      { foo: idFooReducer, bar: { quux: idQuuxReducer, corge: idCorgeReducer } })
    const newState = reducer(state, { type: 'null' })
    expect(newState).toStrictEqual(state)
  })
})
