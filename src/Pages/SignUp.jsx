import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUsername('');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
      setError('');
      alert('User created successfully!');
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('User signed in with Google successfully!');
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen relative bg-gray-100">
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl inline-block">Sign Up</h2>
          <Link to="/">
            <button type="button" className="text-xl inline-block">X</button>
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-full"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-full"
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

        <input
          type="password"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-full"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mb-4">
          Sign Up
        </button>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          Sign Up with Google
        </button>
      </form>
    </div>
  );
};

export default SignUp;
