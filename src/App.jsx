
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from 'react';
import NavigationRoutes from './routes/routes';
import { useNavigate } from 'react-router-dom';

function App(props) {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

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
      <NavigationRoutes />
    </div>
  );
}

export default App;

