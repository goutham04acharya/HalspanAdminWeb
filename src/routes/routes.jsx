import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QuestionnariesList from '../Pages/QuestionnariesList';
import Login from '../Pages/auth/Login.jsx';
import CreateQuestionnary from '../Pages/CreateQuestionnary/CreateQuestionnary.jsx';
import AuthRedirect from '../Pages/auth/AuthRedirect.jsx';
import Layout from '../Components/Layout/index.jsx';

function NavigationRoutes({ isAuthenticated, isLoading, props }) {
  return (
    <>
      <AuthRedirect isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route element={<Layout {...props} />}>
          <Route path="/QuestionnariesList" element={<QuestionnariesList />} />
          <Route path="/QuestionnariesList/Create-Questionnary" element={<CreateQuestionnary />} />
        </Route>
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default NavigationRoutes;

