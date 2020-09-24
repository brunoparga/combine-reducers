import { combineReducers } from '.'

test('Works with an empty state and identity action', () => {
  const appState = {}
  const action = { type: 'identity' }
  expect(combineReducers({})(appState, action)).toStrictEqual({})
})

test('Works with a non-empty state and identity action', () => {
  const appState = { foo: 'bar' }
  const action = { type: 'identity' }
  expect(combineReducers({})(appState, action)).toStrictEqual({})
})
