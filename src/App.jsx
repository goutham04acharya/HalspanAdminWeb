
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
import NavigationRoutes from './routes/routes';
import { useNavigate } from 'react-router-dom';
import Toast from './Components/Toast/Toast.jsx';
import GlobalContext from './Components/Context/GlobalContext.jsx';
import { motion } from 'framer-motion';

function App(props) {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const navigationPath = NavigationRoutes(props);
  const [ToastSuccess, setToastSuccess] = useState('');
  const [ToastError, setToastError] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    } else if (isAuthenticated) {
      navigate("/QuestionnairesList");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GlobalContext.Provider value={{
        setToastSuccess,
        setToastError,
      }}>
        <motion.div className='overflow-x-hidden h-screen relative'>
          {ToastSuccess !== '' && <Toast
            message={ToastSuccess}
            type="success"
            setToastmessage={setToastSuccess} />}
          {ToastError !== '' && <Toast
            message={ToastError}
            type="error"
            setToastmessage={setToastError} />}
          {navigationPath}
        </motion.div>
      </GlobalContext.Provider>
    </div>
  );
}

export default App;

