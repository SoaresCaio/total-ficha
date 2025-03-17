import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientWorkout from './components/ClientWorkout';
import TrainerDashboard from './components/TrainerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientWorkout />} />
        <Route path="/trainer" element={<TrainerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;