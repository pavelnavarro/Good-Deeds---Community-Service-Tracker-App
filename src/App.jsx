import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import SignUp from './Pages/SignUp';
import StreakPage from './Pages/StreakPage';
import UserEvents from './Pages/UserEvents';




  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/streak" element={<StreakPage />} />
          <Route path="/events" element={<UserEvents />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;

