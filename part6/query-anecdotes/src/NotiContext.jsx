import { createContext, useReducer } from 'react';

// Create the Notification Context
const NotificationContext = createContext();

// Reducer for handling notification state
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;
    case 'CLEAR_NOTIFICATION':
      return '';
    default:
      return state;
  }
};

// NotificationProvider component to wrap your app with context
export const NotificationProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, '');

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
