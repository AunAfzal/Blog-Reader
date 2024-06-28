import React, { useState, useEffect } from 'react';
import Blog from '../components/blog';
const Home = () => {
  const [popularToggle, setPopularToggle] = useState(false);
  const [latestToggle, setLatestToggle] = useState(false);
  const [blogs, setBlogs]= useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]); // State for selected filters
  const [showFilterDropdown, setShowFilterDropdown] = useState(false); // State for showing/hiding the filter dropdown


  const usernameCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('username='));

  const username = usernameCookie ? usernameCookie.split('=')[1] : null;



  const handleFilterToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterOptionToggle = (option) => {
    // Toggle the selected filter options
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  const handleFilterGo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogs: blogs, // Pass the blogs array to the server
          filterTags: selectedFilters, // Pass the selected filter tags
        }),
      });
  
      if (response.ok) {
        const filteredBlogs = await response.json();
        setBlogs(filteredBlogs); // Update the blogs state with the filtered blogs
        setLatestToggle(false);
        setPopularToggle(false);
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      console.error('Error filtering blogs:', error);
    }
  
    setShowFilterDropdown(false); // Hide the filter dropdown after applying the filter
  };
      
  
  const handlePopularToggle = async () => {
    if(!popularToggle){
      const response = await fetch('http://localhost:5000/api/blogs/popular'); 
      const data = await response.json();
      setBlogs(data);
    }
    else{
      fetchBlogs();
    }
    setPopularToggle(!popularToggle);
    setLatestToggle(false); // Automatically toggle off the other button
  };

  const handleLatestToggle = async () => {
    if(!latestToggle){
      const response = await fetch('http://localhost:5000/api/blogs/latest');
      const data = await response.json();
      setBlogs(data);
    }
    else{
      fetchBlogs();
    }
    setLatestToggle(!latestToggle);
    setPopularToggle(false); // Automatically toggle off the other button
  };


  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/'); 
      const data = await response.json();
      if(data){
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/search?term=${searchQuery}`);
      const data = await response.json();
      setBlogs(data); // Update the blogs state with the fetched data
      setLatestToggle(false);
      setPopularToggle(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
    <div className="home">
      <h1>Home</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <div className="filter-dropdown">
        <button onClick={handleFilterToggle}>Filter</button>
        {showFilterDropdown && (
          <div className="options">
            {['Technology', 'Travel', 'Food', 'Lifestyle', 'Fashion'].map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedFilters.includes(option)}
                  onChange={() => handleFilterOptionToggle(option)}
                />
                {option}
              </label>
            ))}
            <button onClick={handleFilterGo}>Go</button>
          </div>
        )}
      </div>
      </div>
      <div className="toggle-buttons">
        <button className={`popular-button ${popularToggle ? 'active' : ''}`} onClick={handlePopularToggle}>
          Popular
        </button>
        <button className={`latest-button ${latestToggle ? 'active' : ''}`} onClick={handleLatestToggle}>
          Latest
        </button>
        <br />
      </div>
      {blogs.length > 0 ? (
        blogs.map((blog, index) => (
          <Blog
            key={index}
            id= {blog._id}
            title={blog.title}
            author={blog.author.username} // Access the username property within the author object
            overview={blog.overview}
          />
        ))
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
};

export default Home;
