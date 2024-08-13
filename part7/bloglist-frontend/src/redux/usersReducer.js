// redux/usersReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})
export const { setUsers } = usersSlice.actions
export default usersSlice.reducer
export const initializeUsers = () => {
  return async (dispatch) => {
    const Users = await userService.getAll()
    dispatch(setUsers(Users))
    // console.log(Users)
  }
}
