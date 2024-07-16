
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QuestionnairesList from '../Pages/QuestionnairesList';
import Login from '../Pages/auth/AuthPOC/Login.jsx'; // Import the Login component

function NavigationRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/QuestionnairesList" element={<QuestionnairesList />} />
      {/* Add other routes here */}
    </Routes>
  );
}

export default NavigationRoutes;

