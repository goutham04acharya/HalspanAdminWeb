import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../Pages/auth/Login.jsx';
import CreateQuestionnary from '../Pages/CreateQuestionnary/CreateQuestionnary.jsx';
import AuthRedirect from '../Pages/auth/AuthRedirect.jsx';
import Layout from '../Components/Layout/index.jsx';
import Questionnaries from '../Pages/QuestionnariesList/index.jsx';
import QuestionnaryForm from '../Pages/QuestionnaryForm/index.jsx';
import LookupDataset from '../Pages/LookupDataset/index.jsx';

function NavigationRoutes({ isAuthenticated, isLoading, props }) {
  return (
    <>
      <AuthRedirect isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route element={<Layout {...props} />}>
          <Route path="/questionnaries" element={<Questionnaries />} />
          <Route path="/questionnaries/create-questionnary" element={<CreateQuestionnary />} />
          <Route path="/questionnaries/create-questionnary/questionnary-form" element={<QuestionnaryForm/>}/>
          <Route path="/lookup-dataset" element={<LookupDataset />} />
        </Route>
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default NavigationRoutes;

