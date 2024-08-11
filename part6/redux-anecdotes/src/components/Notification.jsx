// components/Notification.js
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(state => state.notification);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    backgroundColor: '#e7f0ff',
    borderRadius: 5,
    margin: 10,
    display: notification ? '' : 'none'
  };

  return (
    <div style={style}>
      {notification}
    </div>
  );
};

export default Notification;
