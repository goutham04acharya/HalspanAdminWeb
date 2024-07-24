import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthRedirect({ isAuthenticated, isLoading }) {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!isAuthenticated) {
  //       navigate("/login");
  //     } else if (isAuthenticated) {
  //       navigate("/QuestionnariesList");
  //     }
  //   }
  // }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (isAuthenticated && window.location.pathname === '/') {
        navigate("/QuestionnariesList");
      }
    }
  }, [isAuthenticated, isLoading]);
  
  return null;
}

export default AuthRedirect;
