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
import { auth0ClientID } from '../config/index.js';
import { useAuth0 } from '@auth0/auth0-react';

function NavigationRoutes({ isAuthenticated, isLoading, props }) {
  const { logout } = useAuth0();
  useEffect(() => {
    debugger
    let body = localStorage.getItem(`@@auth0spajs@@::${auth0ClientID}::default::openid profile email`);
    body = JSON.parse(body)
    if (body) {
      const expiryTimestamp = body.expiresAt * 1000; // Multiply by 1000 to convert to milliseconds
      const currentTime = new Date().getTime(); // Get current time in milliseconds

      if (currentTime >= expiryTimestamp) {
        // If current time is greater than or equal to the expiry time, logout
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    }

  }, [])
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

