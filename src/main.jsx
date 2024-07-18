
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { auth0Domain } from './config/index.js';
import { auth0ClientID } from './config/index.js'

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientID}
    
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>,
);