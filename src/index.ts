type Action = { type: string, payload?: any }
type Reducer<T> = (appState: T, action: Action) => T
type SliceReducer<T, K extends keyof T> = (
  (appState: T, action: Action) => Record<K, T[K]>
)

export function combineReducers<T> (x: T): Reducer<T> { return () => x }
