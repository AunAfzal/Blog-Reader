import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import jwtDecode from 'jwt-decode';

const Navbar = () => {
  const history = useHistory();
  const usernameCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('username='));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');



  const checkTokenValidity = (token) => {
    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(token);

      // Check if the token is expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        console.log('Token has expired');
        return false;
      }

      // Token is valid
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  
  const jwtCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('jwt='));
  const userIdCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('userId='));

  const jwtToken = jwtCookie ? jwtCookie.split('=')[1] : null;
  const userId = userIdCookie ? userIdCookie.split('=')[1] : null;



  const isVerfied = checkTokenValidity(jwtToken);
  

  const username = usernameCookie ? usernameCookie.split('=')[1] : null;


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  

  const handleDeleteAccount = async () => {
    // Send a request to delete the account using the provided route
    const response = await fetch('http://localhost:5000/api/users/deleteAccount', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        password,
      }),
    });

    if (response.ok) {
      // Account deleted successfully, navigate to the home page
      handleLogout();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">BlogReader</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/publish">Publish Blog</Link>
        {isVerfied ? (
          <button className="profile-btn" onClick={toggleMenu}>
          My Profile
        </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      {isVerfied && isMenuOpen && (
        <div className="profile-menu">
          <button className="back-btn" onClick={toggleMenu}>
            &lt; Back
          </button>
          <div className="profile-info">
            <p className="username">{username}</p>
            <p><Link to="/myProfile/liked" className='no-underline'>Liked Blogs</Link></p>
            <p><Link to="/myProfile/blogs" className='no-underline'>My Blogs</Link></p>
            <p><Link to="/myProfile/comments" className='no-underline'>My Comments</Link></p>
            <button className='logout-btn' onClick={() => setShowConfirmation(true)}>Delete Account</button>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      {showConfirmation && (
        <div className="confirmation-box">
          <p>Are you sure you want to delete your account?</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleDeleteAccount}>Confirm</button>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
