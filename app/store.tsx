import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import RootReducer from './screens/rootReducer'
import Reactotron from '../ReactotronConfig'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const reduxEnhancer = Reactotron.createEnhancer!()

const store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  enhancers: [reduxEnhancer],
})
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
