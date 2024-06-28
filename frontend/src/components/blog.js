import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ id, title, author, overview, deleteButton, onDataRefetch }) => {


  const handleDelete = async () => {
    try {
      // Delete the blog using the provided API
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
       console.log('Blog deleted successfully');
       onDataRefetch();
      } else {
        console.error('Error deleting blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="blog">
      <Link to={`/blog/${id}`} className="no-underline"> 
        <h2 className="blog-title">{title}</h2>
        <p className="blog-author">Author: {author}</p>
        <p className="blog-overview">{overview}</p>
      </Link>
      {deleteButton && <button className='delete-btn' onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default Blog;
 