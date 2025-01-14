
import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <div>
      <img alt='Redirecting to login...' />
    </div>
  );
}

export default Login;

