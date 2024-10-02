// src/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/home')
      alert('Logged in with Google!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (

    <>
    
        <h2 className="text-2xl mb-4">Log In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleEmailSignIn} className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 mb-2 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 mb-4 w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mb-2">
            Log in with Email
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          Log in with Google
        </button>
        </>
  );
};

export default Login;