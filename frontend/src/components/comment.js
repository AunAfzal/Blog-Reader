import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';


const Comment = ({id, user, comment, createdAt, blog, deleteButton, onDataRefetch }) => {
  

  const handleDelete = async () => {
    try {
      // Delete the blog using the provided API
      const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
       console.log('Comment deleted successfully');
       onDataRefetch();
      } else {
        console.error('Error comment blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error comment blog:', error);
    }
  };
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });


  return (
    <div className="comment">
      {blog && <p>Posted on: <strong>{blog.title}</strong> </p>}
      <strong>{user}</strong>:
      <p>{comment}</p>
      <span className="time-ago" style={{ fontSize: '0.8rem' }}>{timeAgo}</span>
      <br />
      <br />
      {deleteButton && <button className='delete-btn' onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default Comment;
