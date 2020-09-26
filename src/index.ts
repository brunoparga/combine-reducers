export type Action = { type: string, payload?: any }
export type Reducer<T> = (appState: T, action: Action) => T
export type SliceReducer<T, K extends keyof T> = ((appState: T, action: Action) => Record<K, T[K]>)
type argumentSlice<T, K extends keyof T> = Record<K, T[K]>
type FunctionOrObject<T> = [keyof T, Function] | [keyof T, object]
type Combiner<T> = (state: T, [slice, sliceReducer]: FunctionOrObject<T>) => T

function getCombiner<T> (appState: T, action: Action): Combiner<T> {
  return function <T> (state: T, [slice, sliceReducer]: FunctionOrObject<T>): T {
    if (typeof sliceReducer === 'object') {
      const newState: any = combineReducers(sliceReducer)(appState, action)
      return { ...state, [slice]: newState[slice] }
    }
    return { ...state, [slice]: sliceReducer(appState, action)[slice] }
  }
}

export default function combineReducers<T>
(sliceReducers: argumentSlice<T, keyof T>): Reducer<T> {
  return (appState: T, action: Action) => {
    const entries = Object.entries(sliceReducers) as Array<FunctionOrObject<T>>
    return entries.reduce(getCombiner(appState, action), appState)
  }
}
