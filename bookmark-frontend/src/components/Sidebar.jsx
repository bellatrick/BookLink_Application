import { useState } from 'react';
import { BookDashed, ListCollapseIcon, LogOut, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth0();

  return (
    <div
      className={`h-screen bg-gray-900 text-white ${
        isCollapsed ? 'w-20' : ' w-20 md:w-64'
      } flex flex-col justify-between transition-width duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className='text-gray-200 font-bold text-[20px] p-3 focus:outline-none text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 hover:bg-gray-700 transition-colors'
      >
        {isCollapsed ? '>' : '<'}
      </button>

      {/* Logo */}
      <div className='p-4 flex items-center space-x-2'>
        <span className='text-xl font-bold'>📚</span>
        {!isCollapsed && (
          <h1 className='text-xl hidden md:block font-bold'>BookLinks</h1>
        )}
      </div>

      {/* Menu Items */}
      <nav className='flex-1 space-y-2 p-4'>
        <MenuItem
          icon={<BookDashed />}
          label='Bookmarks'
          isCollapsed={isCollapsed}
          link='/'
        />

        <MenuItem
          icon={<ListCollapseIcon />}
          label='Collections'
          isCollapsed={isCollapsed}
          link='/collections'
        />
        <MenuItem
          icon={<Search />}
          label='Search'
          isCollapsed={isCollapsed}
          link='/search'
        />
      </nav>

      {/* Logout Button */}
      <div className='p-4'>
        <MenuItem
          icon={<LogOut />}
          label='Logout'
          isCollapsed={isCollapsed}
          className='text-red-500'
          handleLogout={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        />
      </div>
    </div>
  );
}

// Menu Item Component
function MenuItem({
  icon,
  label,
  isCollapsed,
  handleLogout,
  link,
  className = ''
}) {
  return handleLogout ? (
    <div
      onClick={handleLogout}
      className={`flex items-center p-2 space-x-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors group ${className}`}
    >
      <div className='text-gray-200'>{icon}</div>
      {!isCollapsed && (
        <span className='text-gray-200 hidden md:block'>{label}</span>
      )}
      {isCollapsed && (
        <span className='absolute left-20 px-2 py-1 text-sm text-gray-200 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity'>
          {label}
        </span>
      )}
    </div>
  ) : (
    <Link
      to={link}
      className={`flex items-center p-2 space-x-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors group ${className}`}
    >
      <div className='text-gray-200'>{icon}</div>
      {!isCollapsed && (
        <span className='text-gray-200 hidden md:block'>{label}</span>
      )}
      {isCollapsed && (
        <span className='absolute left-20 px-2 py-1 text-sm text-gray-200 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity'>
          {label}
        </span>
      )}
    </Link>
  );
}

export default Sidebar;
