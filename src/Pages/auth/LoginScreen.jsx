import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Image from '../../Components/Image/Image.jsx';
import InputField from '../../Components/InputField/InputField.jsx';
import Button from '../../Components/Button/button.jsx';

const LoginScreen = () => {
  const [logindetails, setLogindetails] = useState({
    email: '',
    password: '',
  });
  const [isThreedotLoader, setIsThreedotLoader] = useState(false)

  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLogindetails(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsThreedotLoader(true)
    try {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleApiCall = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token, 'token')
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logindetails),
      });

      const data = await response.json();
      setIsThreedotLoader(false)
      console.log('API response:', data);
      // Handle successful login and API response
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  if (isAuthenticated) {
    handleApiCall();
  }

  return (
    <div className='bg-[#F4F6FA] w-full h-screen pt-[7%]'>
      <div className='w-[30%] h-auto mx-auto py-[48px] px-[55px] bg-white'>
        <Image src="Logo-Halspan" alt="Logo-Halspan" className='mx-auto' />
        <p className='py-[38px] text-center w-full font-medium text-[28px] text-[#2B333B]'>Log in</p>
        <div className='py-[46px] px-[34px] bg-[#F4F6FA] rounded-[10px]'>
          <InputField
            autoComplete='off'
            testId={'email'}
            htmlFor={'email'}
            id={'email'}
            type='email'
            value={logindetails?.email}
            placeholder={'Email Address'}
            className={'w-full h-10 bg-white placeholder:text-base placeholder:normal placeholder:text-[#9FACB9] border border-[#AEB3B7] px-[14px] py-[10px] rounded'}
            maxlength={100}
            validationError={false}
            handleChange={handleChange}
          />

          <InputField
            autoComplete='off'
            testId={'password'}
            htmlFor={'password'}
            id={'password'}
            type='password'
            value={logindetails?.password}
            placeholder={'Password'}
            className={'w-full h-10 bg-white placeholder:text-base placeholder:normal placeholder:text-[#9FACB9] border border-[#AEB3B7] px-[14px] py-[10px] rounded mt-6'}
            maxlength={100}
            validationError={false}
            handleChange={handleChange}
          />

          <div className='my-6 flex items-center'>
            <input id="remember" type="checkbox" className='w-7 h-7 RememberMe border border-[#AEB3B7]' />
            <label htmlFor="remember" className='ml-[11px] font-normal text-[16px] text-[#2B333B]'>Remember Me</label>
          </div>
          <div>
            <Button
              text='Login'
              onClick={handleLogin}
              data-testid='login-btn'
              className='w-full py-4'
              isThreedotLoading={isThreedotLoader}
            />
          </div>
          <p className='mt-5 text-center font-normal text-base text-[#2B333B]'><u>Forgot password</u></p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
