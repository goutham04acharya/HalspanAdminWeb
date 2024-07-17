
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_API_DOMAIN}
    // domain="dev-hjr0lxj23dh6f5qc.uk.auth0.com"
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    // clientId="Tp6s9L1kHp2qU7ICnauxcKa9VKZeMnlG"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>,
);