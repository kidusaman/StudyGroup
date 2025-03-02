// src/Notifications.js
import React, { useEffect, useState } from 'react';

function Notifications({ user, socket }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!user || !socket) return;
    const eventName = `notification-${user.id}`;
    const handleNotification = (notification) => {
      console.log("Received notification: ", notification);
      // Prepend the new notification to the list
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on(eventName, handleNotification);
    return () => {
      socket.off(eventName, handleNotification);
    };
  }, [user, socket]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={toggleDropdown} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>
        🔔
        {notifications.filter(n => !n.is_read).length > 0 && (
          <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '4px', fontSize: '14px' }}>
            {notifications.filter(n => !n.is_read).length}
          </span>
        )}
      </button>
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '30px',
          right: 0,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '5px',
          width: '250px',
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '10px' }}>No notifications.</div>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
