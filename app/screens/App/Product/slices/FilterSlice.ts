import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  data: {},
  search: undefined,
}

export const FilterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      state.data = action.payload
    },
    handleSearch: (state, action) => {
      state.search = action.payload.search
    },
    clearFilter: () => {
      return initialState
    },
  },
})

export const { updateFilter, handleSearch, clearFilter } = FilterSlice.actions

export default FilterSlice.reducer
