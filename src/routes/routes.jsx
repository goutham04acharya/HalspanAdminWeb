import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../Pages/auth/Login.jsx';
import CreateQuestionnary from '../Pages/CreateQuestionnary/CreateQuestionnary.jsx';
import AuthRedirect from '../Pages/auth/AuthRedirect.jsx';
import Layout from '../Components/Layout/index.jsx';
import Questionnaries from '../Pages/QuestionnariesList/index.jsx';
import QuestionnaryForm from '../Pages/QuestionnaryForm/index.jsx';
import LookupDataset from '../Pages/LookupDataset/index.jsx';
import VersionList from '../Pages/VersionList/VersionList.jsx';
import { useAuth0 } from '@auth0/auth0-react';

function NavigationRoutes({ isAuthenticated, isLoading, props }) {
  const { logout, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
 
  /**
   * The function `decodeJWT` decodes a JSON Web Token (JWT) by extracting the payload, base64 decoding
   * it, and parsing it as JSON.
   * @returns The function `decodeJWT` decodes a JSON Web Token (JWT) by extracting the payload from
   * the token, base64 decoding it, and then parsing it as JSON. The decoded JSON payload is returned
   * as the output of the function.
   */
  function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      //check if token is available
      if (isAuthenticated) {
        try {
          // Attempt to token
          const tokenClaims = await getIdTokenClaims();
          const accessToken = tokenClaims.__raw;

          //decoding token
          const decodeToken = decodeJWT(accessToken);
          const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
          // checking the expiry of the token 
          if (decodeToken.exp < currentTime) {
            logout({ returnTo: window.location.origin });
          }
        } catch (error) {
          if (error.error === 'login_required' || error.error === 'consent_required') {
            console.log("User needs to log in or consent.");

          } else {
            // Handle other errors (e.g., token refresh failure)
            console.error("Error getting access token:", error);
          }
        }
      } else {
        console.log("User is not authenticated.");
      }
    };

    checkAuthentication();
  }, [isAuthenticated, getAccessTokenSilently, logout]);
  return (
    <>
      <AuthRedirect isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout {...props} />}>
          <Route path="/questionnaries" element={<Questionnaries />} />
          <Route path="/questionnaries/create-questionnary" element={<CreateQuestionnary />} />
          <Route path="/lookup-dataset" element={<LookupDataset />} />
          <Route path="/questionnaries/create-questionnary/questionnary-form/:questionnaire_id/:version_number" element={<QuestionnaryForm />} />
          <Route path="/questionnaries/version-list/:public_name/:questionnaire_id" element={<VersionList />} />
        </Route>
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default NavigationRoutes;

