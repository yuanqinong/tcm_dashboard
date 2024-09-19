import { useState } from 'react';

const useAlert = () => {
  const [alertState, setAlertState] = useState({
    message: '',
    severity: 'info',
    duration: 3000,
  });

  const showAlert = (message, severity = 'info', duration = 3000) => {
    setAlertState({ message, severity, duration });
  };

  return { alertState, showAlert};
};

export default useAlert;