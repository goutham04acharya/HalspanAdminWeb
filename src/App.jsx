
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
import NavigationRoutes from './routes/routes';
import Toast from './Components/Toast/Toast.jsx';
import GlobalContext from './Components/Context/GlobalContext.jsx';
import { motion } from 'framer-motion';

function App(props) {
  const { isAuthenticated, isLoading } = useAuth0();
  const [ToastSuccess, setToastSuccess] = useState('');
  const [ToastError, setToastError] = useState('');
  // const [showLoading, setShowLoading] = useState(false);

  // useEffect(() => {
  //   let timer;

  //   if (isLoading) {
  //     // Set a timer to delay the loading display
  //     timer = setTimeout(() => {
  //       setShowLoading(true);
  //     }, 400);
  //   } else {
  //     // Clear the loading state immediately if no longer loading
  //     setShowLoading(false);
  //   }

  //   // Clean up the timer
  //   return () => clearTimeout(timer);
  // }, [isLoading]);

  // if (showLoading) {
  //   return (
  //     <div>
  //       <img src='/halspan-loading.gif' alt='Loading...' />
  //     </div>
  //   );
  // }

  return (
    <div>
      <GlobalContext.Provider value={{
        setToastSuccess,
        setToastError,
      }}>
        <motion.div className='overflow-x-hidden overflow-y-hidden h-screen relative'>
          {ToastSuccess !== '' && <Toast
            message={ToastSuccess}
            type="success"
            setToastmessage={setToastSuccess} />}
          {ToastError !== '' && <Toast
            message={ToastError}
            type="error"
            setToastmessage={setToastError} />}
          <NavigationRoutes isAuthenticated={isAuthenticated} isLoading={isLoading} />
        </motion.div>
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
