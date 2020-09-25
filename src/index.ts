export type Action = { type: string, payload?: any }
export type Reducer<T> = (appState: T, action: Action) => T
export type SliceReducer<T, K extends keyof T> = (
  (appState: T, action: Action) => Record<K, T[K]>
)
type argumentSlice<T, K extends keyof T> = Record<K, T[K]>

export default function combineReducers<T>
(sliceReducers: argumentSlice<T, keyof T>): Reducer<T> {
  return (appState: T, action: Action) => {
    const entries = Object.entries(sliceReducers) as [string, Function][]
    return entries.reduce((state, [slice, sliceReducer]) => {
      return { ...state, [slice]: sliceReducer(appState, action)[slice] }
    }, appState) as unknown as T
  }
}
