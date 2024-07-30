import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../Pages/auth/Login.jsx';
import CreateQuestionnary from '../Pages/CreateQuestionnary/CreateQuestionnary.jsx';
import AuthRedirect from '../Pages/auth/AuthRedirect.jsx';
import Layout from '../Components/Layout/index.jsx';
import Questionnaries from '../Pages/QuestionnariesList/index.jsx';
import QuestionnaryForm from '../Pages/QuestionnaryForm/index.jsx';

function NavigationRoutes({ isAuthenticated, isLoading, props }) {
  return (
    <>
      <AuthRedirect isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route element={<Layout {...props} />}>
          <Route path="/questionnaries" element={<Questionnaries />} />
          <Route path="/questionnaries/create-questionnary" element={<CreateQuestionnary />} />
          <Route path="/QuestionnariesList/Create-Questionnary/QuestionnaryForm" element={<QuestionnaryForm/>}/>
        </Route>
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default NavigationRoutes;

