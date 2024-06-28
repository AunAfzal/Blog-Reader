import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to manage the error message

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a JSON object with the login credentials
    const loginData = {
      email,
      password,
    };
  
    try {
      // Make a POST request to the backend API for login
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      // Check if the login was successful
      if (response.ok) {
        const data = await response.json();
  
        // Calculate the expiration date for the cookies (3 days from now)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 3);
  
        // Set JWT and username as cookies with expiration date
        document.cookie = `jwt=${data.token}; expires=${expirationDate.toUTCString()}; path=/`; // Set JWT cookie
        document.cookie = `username=${data.username}; expires=${expirationDate.toUTCString()}; path=/`; // Set username cookie
        document.cookie = `userId=${data.userId}; expires=${expirationDate.toUTCString()}; path=/`;
  
        console.log('Login Successful:', data); // You can handle the response from the backend
  
        // Redirect the user to the home page (or any other page you want)
        history.push('/');
      } else {
        // If the login failed, update the error state with the error message
        const errorData = await response.json();
        setError(errorData.msg);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="center">
          <Link to="/signup" className='sign'>Sign up</Link>
          <button type="submit" className='login-button'>Login</button>
          {error && <p className="error">{error}</p>} {/* Display the error message if it exists */}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
