import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});

export const setNotification = (mesage, time) => {
  return async dispatch => {
    dispatch(notificationSlice.actions.setNotification(mesage))
    setTimeout(()=> {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export const { clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
