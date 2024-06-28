import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const PublishBlog = () => {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [content, setContent] = useState('');
  const [tags] = useState(['Technology', 'Travel', 'Food', 'Lifestyle', 'Fashion']); // Available tags
  
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
  const usernameCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('username='));

  const username = usernameCookie ? usernameCookie.split('=')[1] : null;
  const [error, setError] = useState('');

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!isVerfied) {
      setError('You need to be logged in to publish a blog.');
      return;
    }

    // Create the JSON object representing the blog data
    const blogData = {
      title,
      overview,
      content,
      userId,
      tags: selectedTags,
    };

    try {
      // Make the POST request to the backend API
      const response = await fetch('http://localhost:5000/api/blogs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      // Check if the request was successful
      if (response.ok) {
        // Reset form fields after successful submission
        setTitle('');
        setOverview('');
        setContent('');
        setSelectedTags([]);
        setError(''); // Clear the error message
        history.push('/');
        console.log('Blog published successfully!');
      } else {
        setError('Failed to publish the blog.');
      }
    } catch (error) {
      setError('Error publishing the blog.');
      console.error('Error publishing the blog:', error);
    }
  };

  

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedTags(selectedOptions);
  };



  return (
    <div className="publish-blog">
      <h1>Publish a Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Overview:</label>
          <textarea value={overview} onChange={(e) => setOverview(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Tags:</label>
          <select multiple value={selectedTags} onChange={handleTagChange} required>
            <option value="" disabled>
              Select tag(s)
            </option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button type="submit">Publish</button>
          {error && <p className="error">{error}</p>} {/* Display the error message if it exists */}
        </div>
        
      </form>
    </div>
  );
};

export default PublishBlog;
