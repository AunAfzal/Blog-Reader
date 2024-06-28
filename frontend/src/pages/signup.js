import React, { useState } from 'react';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a JSON object with the form data
    const userData = {
      username,
      email,
      password,
    };

    try {
      // Make a POST request to the backend API for signup
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();

        // Calculate the expiration date for the cookies (3 days from now)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 3);

        // Set JWT and username as cookies with expiration date
        document.cookie = `jwt=${data.token}; expires=${expirationDate.toUTCString()}; path=/`; // Set JWT cookie
        document.cookie = `username=${data.username}; expires=${expirationDate.toUTCString()}; path=/`; // Set username cookie
        document.cookie = `userId=${data.userId}; expires=${expirationDate.toUTCString()}; path=/`;

        console.log('Signup Successful:', data); // You can handle the response from the backend

        // Redirect the user to the home page (or any other page you want)
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.msg);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className='signup-button'>Sign Up</button>
        {error && <p className="error">{error}</p>} {/* Display the error message if it exists */}
      </form>
    </div>
  );
};

export default SignupPage;
