
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { auth0Domain } from './config/index.js';
import { auth0ClientID } from './config/index.js'
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-responsive-modal/styles.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={auth0Domain}
    // domain='dev-hjr0lxj23dh6f5qc.uk.auth0.com'
    cacheLocation="localstorage"
    clientId={auth0ClientID}
    // clientId='Tp6s9L1kHp2qU7ICnauxcKa9VKZeMnlG'
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </Auth0Provider>,
);