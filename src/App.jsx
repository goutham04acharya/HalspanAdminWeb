
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from 'react';
import QuestionnairesList from './Pages/QuestionnairesList';
import NavigationRoutes from './routes/routes';
import { useNavigate } from 'react-router-dom';

function App(props) {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    } else if (isAuthenticated) {
      navigate("/QuestionnairesList");
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? <NavigationRoutes /> : <div>Redirecting to login...</div>}
    </div>
  );
}

export default App;

