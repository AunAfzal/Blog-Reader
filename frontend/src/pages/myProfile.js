import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Blog from '../components/blog';
import Comment from '../components/comment';
import jwtDecode from 'jwt-decode';

const MyProfile = () => {
    const usernameCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('username='));
    const username = usernameCookie ? usernameCookie.split('=')[1] : null;
    const { mode } = useParams();
    const [heading, setHeading] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);

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

    const handleDataRefetch = () => {
        fetchBlogs();
        fetchComments();
      };

    useEffect(() => {
        if(mode==='blogs'){
            setComments([]);
            setBlogs([]);
            setHeading('My Blogs');
            fetchBlogs();
        }
        else if (mode==='liked'){
            setComments([]);
            setBlogs([]);
            setHeading('Liked Blogs');
            fetchLikedBlogs();
        }
        else if(mode==='comments'){
            setBlogs([]);
            setHeading('My Comments');
            fetchComments();
        }
    }, [mode]);

    const fetchBlogs = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/blogs/myBlogs?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
          const data = await response.json();
          setBlogs(data);
        } catch (error) {
            console.error('Error fetching your blogs:', error);
        }
    };

    const fetchLikedBlogs = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/blogs/liked?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
          const data = await response.json();
          setBlogs(data);
        } catch (error) {
            console.error('Error fetching liked blogs:', error);
        }
    };

    const fetchComments = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/comments/user-comments?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setComments(data);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};


return (
    <div className='myProfile'>
      {isVerfied ? (
        <>
          <h1>{heading}</h1>
          {mode !== 'comments' && blogs.length === 0 && (
            <p>No blogs found.</p>
          )}
          {mode === 'comments' && comments.length === 0 && (
            <p>No comments found.</p>
          )}
          {mode === 'blogs' && blogs.length > 0 && (
            blogs.map((blog, index) => (
              <Blog onDataRefetch={handleDataRefetch}
                key={index}
                id={blog._id}
                title={blog.title}
                author={blog.author.username}
                overview={blog.overview}
                deleteButton={true}
              />
            ))
          )}
          {mode === 'liked' && blogs.length > 0 && (
            blogs.map((blog, index) => (
              <Blog 
                key={index}
                id={blog._id}
                title={blog.title}
                author={blog.author.username}
                overview={blog.overview}
              />
            ))
          )}
          {mode === 'comments' && comments.length > 0 && (
            comments.map((comment, index) => (
              <Comment onDataRefetch={handleDataRefetch}
                key={index}
                user={comment.user.username}
                comment={comment.content}
                createdAt={comment.createdAt}
                deleteButton={true}
                id={comment._id}
                blog={comment.blog}
              />
            ))
          )}
        </>
      ) : (
        <p>You need to be logged in to access this page.</p>
      )}
    </div>
  );
};
 
export default MyProfile;
