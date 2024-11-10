import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut, User2Icon } from 'lucide-react';

function Navbar() {
  const { user, logout, isAuthenticated, loginWithRedirect } = useAuth0();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className='flex justify-between items-center bg-gray-900 p-4 text-gray-100'>
      {/* Logo */}
      <div className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500'>
        BookLinks
      </div>
      <div>
        {' '}
        {!isAuthenticated && (
          <button
            className='moving-gradient-btn px-4 py-3 rounded-md cursor-pointer'
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
        )}
      </div>
      {/* User Info with Dropdown */}
      {user && (
        <div className='relative'>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className='flex items-center space-x-2 hover:bg-gray-700 p-2 rounded focus:outline-none'
          >
            <span className='font-semibold'>{user.name}</span>
            {user.picture ? (
              <img
                src={user.picture}
                alt='User Avatar'
                className='w-8 h-8 rounded-full'
              />
            ) : (
              <User2Icon />
            )}
          </button>

          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-2 z-20'>
              <div className='max-w-[25ch]'>
                {' '}
                <p className='px-4 truncate text-[16px] py-2 text-gray-300'>
                  Email: {user.email}
                </p>
              </div>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className='flex items-center px-4 py-2 text-red-500 hover:bg-gray-600 w-full text-left'
              >
                <LogOut className='mr-2' /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
