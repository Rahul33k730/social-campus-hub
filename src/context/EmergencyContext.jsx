import React, { createContext, useContext, useState } from 'react';

const EmergencyContext = createContext();

export const useEmergency = () => useContext(EmergencyContext);

export const EmergencyProvider = ({ children }) => {
  const [isEmergency, setIsEmergency] = useState(() => {
    return localStorage.getItem('isEmergency') === 'true';
  });
  const [message, setMessage] = useState(() => {
    return localStorage.getItem('emergencyMessage') || "EMERGENCY ALERT: Severe Weather Warning. Campus Closed.";
  });

  const triggerEmergency = (msg) => {
    setMessage(msg);
    setIsEmergency(true);
    localStorage.setItem('isEmergency', 'true');
    localStorage.setItem('emergencyMessage', msg);
  };

  const clearEmergency = () => {
    setIsEmergency(false);
    localStorage.setItem('isEmergency', 'false');
  };

  return (
    <EmergencyContext.Provider value={{ isEmergency, message, triggerEmergency, clearEmergency }}>
      {children}
    </EmergencyContext.Provider>
  );
};
