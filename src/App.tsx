import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './components/Auth/SignInPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import './App.css';

function App() {
  const [signedIn, setSignedIn] = useState(() => {
    // Check for token in localStorage on app load
    return Boolean(localStorage.getItem('authToken'));
  });

  const handleSignIn = (token: string) => {
    // Store the token in localStorage
    localStorage.setItem('authToken', token);
    setSignedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={
            signedIn ? <Navigate to="/dashboard" replace /> : <SignInPage onSignIn={handleSignIn} />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            signedIn ? <DashboardPage /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="*"
          element={
            signedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
