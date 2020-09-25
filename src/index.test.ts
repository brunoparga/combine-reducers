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
