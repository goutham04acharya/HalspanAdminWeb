import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import Login from '../Pages/auth/Login.jsx';
import CreateQuestionnary from '../Pages/CreateQuestionnary/CreateQuestionnary.jsx';
import AuthRedirect from '../Pages/auth/AuthRedirect.jsx';
import Layout from '../Components/Layout/index.jsx';
import Questionnaries from '../Pages/QuestionnariesList/index.jsx';
import QuestionnaryForm from '../Pages/QuestionnaryForm/index.jsx';
import LookupDataset from '../Pages/LookupDataset/index.jsx';
import VersionList from '../Pages/VersionList/VersionList.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import NotFound from '../Components/NotFoundPage/NotFound.jsx';
import { BeatLoader } from 'react-spinners';

function NavigationRoutes({ isAuthenticated, isLoading, props }) {
  const { logout, getAccessTokenSilently, getIdTokenClaims } = useAuth0();

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
      if (isAuthenticated) {
        try {
          const tokenClaims = await getIdTokenClaims();
          const accessToken = tokenClaims.__raw;
          const decodeToken = decodeJWT(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodeToken.exp < currentTime) {
            logout({ returnTo: window.location.origin });
          }
        } catch (error) {
          if (error.error !== 'login_required' && error.error !== 'consent_required') {
            console.error("Error getting access token:", error);
          }
        }
      }
    };

    checkAuthentication();
  }, [isAuthenticated, getAccessTokenSilently, logout]);



  // Parse query parameters from the URL
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const code = query.get('code');


  // Conditionally render based on the `code` query parameter
  const HandleRoute = () => {
    if (code) {
      return <div className='flex justify-center items-center h-screen'> <BeatLoader color="#000" size={'40px'} /></div>; // Show loading when `code` is present
    } else {
      return <NotFound />; // Show 404 if `code` is not present
    }
  };

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
          <Route path="/questionnaries/version-list/:questionnaire_id" element={<VersionList />} />
        </Route>


        {/* Handle route with `code` query parameter */}
        <Route path="/" element={<HandleRoute />} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default NavigationRoutes;
