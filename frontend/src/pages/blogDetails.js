import React, { useState, useEffect } from 'react';
import  Comment from '../components/comment';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';


const BlogDetailsPage = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const[error, setError] = useState('');


  const usernameCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('username='));

  const username = usernameCookie ? usernameCookie.split('=')[1] : null;

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


  const { id } = useParams();

  useEffect(() => {
    fetchBlog();
    fetchComments();
 }, []);


 const fetchComments = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/comments/${id}`);
    const commentsData = await response.json();
    setComments(commentsData); // Assuming the API returns the comments directly
  } catch (error) {
    console.error('Error fetching comments:', error);
    setError(error.msg);
  }
};

 const fetchBlog = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/blogs/${id}`); 
    const data = await response.json();
    if (data) {
      setBlog(data);
      setLikes(data.likes);
      setError('');

      if (username) {
        const likedResponse = await fetch(`http://localhost:5000/api/blogs/liked?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (likedResponse.ok) {
          const likedBlogsData = await likedResponse.json();
          const userHasLiked = likedBlogsData.some(blog => blog._id === data._id);
          setLiked(userHasLiked);
        } else {
          const errorData = await likedResponse.json();
          setError(errorData.msg); // Update the error state with the error message
        }
      }
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    setError(error.msg);
  }
};


const handleCommentChange = (e) => {
  setNewComment(e.target.value);
};

const handleAddComment = async () => {
  if (newComment.trim() === '') return;
  if(isVerfied){
  try {
    const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newComment,
        userId: userId, // Replace with actual username
      }),
    });

    if (response.ok) {
      // Refresh comments after adding a new comment
      fetchComments();
      setError('');
      setNewComment('');
    } else {
      const errorData = await response.json();
      setError(errorData.msg); // Update the error state with the error message
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
  }
  else{
    setError('You need to be logged in for this feature');
  }
};

  const likePost = async () => {
    if(blog && isVerfied){
      try{
      const response = await fetch(`http://localhost:5000/api/users/${blog._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId
          }),
        });
    
        if (response.ok) {
          if(liked){
            setLikes(likes-1);
            setLiked(false);
          }
          else{
            setLikes(likes+1);
            setLiked(true);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.msg); // Update the error state with the error message
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
    else{
      setError('You need to be logged in for this feature');
    }
  };


  return (
    <div className="blog-details-page">
      {blog &&<div className="blog-details">
        <h1>{blog.title}</h1>
        <p>By {blog.author.username}</p>
        <p>{blog.content}</p>
        <button className="like-button" onClick={likePost}>Like</button>
        <span className="like-counter">Likes: {likes} </span>
        <p className='views'>Views: {blog.views}</p>
      </div>
      }
      {error && <p className="error">{error}</p>}
      <div className="comments-section">
        <h2>Comments</h2>
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={handleCommentChange}
        />
        <button className="add-comment-button" onClick={handleAddComment}>
          Add Comment
        </button>
        {comments.length > 0 ? (
          comments.map((comment,index) => (
            <Comment key={index} user={comment.user.username} comment={comment.content} createdAt={comment.createdAt} id={comment._id}/>
          ))
        ) : (
          <p>No comments posted yet</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsPage;


