import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import QuestionnairesList from '../Pages/QuestionnairesList';

function NavigationRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/QuestionnairesList" element={<QuestionnairesList />} />
      {/* Add other routes here */}
    </Routes>
  );
}

export default NavigationRoutes;
