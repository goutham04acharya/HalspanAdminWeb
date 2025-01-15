
import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <div>
      <h1>Redirecting to login...</h1> 
    </div>
  );
}

export default Login;

