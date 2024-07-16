
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-yug5zr4z0xpzuzmt.us.auth0.com"
    clientId="dTuIY3LMWj2NQORW6zEfk1GdpElc5cSc"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
     <Router>
      <App />
    </Router>
  </Auth0Provider>,
);