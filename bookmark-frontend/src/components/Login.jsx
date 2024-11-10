import React from 'react';import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='w-screen h-screen flex-col gap-8 flex justify-center items-center bg-gray-950 text-white'>
      <h3 className='text-center text-[48px] text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500'>
        Welcome to BookLinks
      </h3>

      <button
        className='moving-gradient-btn px-4 py-3 rounded-md cursor-pointer'
        onClick={() => loginWithRedirect()}
      >
        Log In
      </button>
    </div>
  );
};

export default LoginButton;
