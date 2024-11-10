import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Dashboard from './pages/Dashboard';
import Collections from './pages/Collections';
import Search from './pages/Search';
import SharedBookmark from './pages/SharedBookmark';
import Layout from './components/Layout';

const App = () => {
  console.log(process.env.REACT_APP_AUTH0_AUDIENCE,process.env.REACT_APP_AUTH0_DOMAIN,process.env.REACT_APP_AUTH0_CLIENT_ID);
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
         audience: process.env.REACT_APP_AUTH0_AUDIENCE
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Dashboard />} />
            <Route path="collections" element={<Collections />} />
            <Route path="search" element={<Search />} />
            <Route path="shared/:shareToken" element={<SharedBookmark />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
};

export default App;