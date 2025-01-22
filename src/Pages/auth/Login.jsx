
import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BeatLoader } from 'react-spinners';

function Login() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <div>
      <h1><div className='flex justify-center items-center h-screen'> <BeatLoader color="#000" size={'40px'} /></div></h1> 
    </div>
  );
}

export default Login;

