const bcrypt = require('bcrypt');
const User = require('../models/users');
const Blog = require('../models/blogs');
const Comment = require('../models/comments');

const jwt = require('jsonwebtoken')

const createToken = (_id)=>{
    return jwt.sign({_id},process.env.SECRETE,{expiresIn:'3d'})
}

async function signup(req, res) {
  const { email, password, username } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user document using the User model
    const user = await User.create({ email, password: hashedPassword, username, likedBlogs: [] });

    const token = createToken(user._id);

    // Send a success response with user's ObjectId
    res.status(200).json({ userId: user._id, username, token });

  } catch (error) {
    // Send an error response
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid user or password' });
    }

    // Password is valid, proceed with login logic

    const token = createToken(user._id);

    // Send a success response with user's ObjectId
    res.status(200).json({ userId: user._id, username: user.username, token });

  } catch (error) {
    // Send an error response
    res.status(400).json({ error: 'Unable to login' });
  }
}


async function like(req, res) {
  try {
    const { blogId } = req.params;
    const { userId } = req.body;

    // Find the user and the blog based on their ObjectIDs
    const user = await User.findById(userId);
    const blog = await Blog.findById(blogId);

    if (!user || !blog) {
      return res.status(404).json({ msg: 'User or blog not found' });
    }

    // Check if the blog is already liked by the user
    const isLiked = user.likedBlogs.includes(blogId);

    if (isLiked) {
      // Unlike the blog
      // Remove the blog's ObjectID from the user's likedBlogs array
      user.likedBlogs = user.likedBlogs.filter((likedBlogId) => likedBlogId.toString() !== blogId);

      // Decrease the blog's likes count by 1
      blog.likes--;

      // Save the updated user and blog documents
      await user.save();
      await blog.save();

      return res.status(200).json({ msg: 'Blog unliked successfully' });
    }

    // Like the blog
    // Add the blog's ObjectID to the user's likedBlogs array
    user.likedBlogs.push(blogId);

    // Increase the blog's likes count by 1
    blog.likes++;

    // Save the updated user and blog documents
    await user.save();
    await blog.save();

    res.status(200).json({ msg: 'Blog liked successfully' });
  } catch (error) {
    console.error('Error liking/unliking blog:', error);
    res.status(500).json({ msg: 'Error liking/unliking blog' });
  }
}


  

  async function deleteUser(req, res) {
    try {
      const { userId, password } = req.body;
  
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Compare the hashed password from the request with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ msg: 'Password incorrect' });
      }
  
      // Remove user's liked blogs and associated comments
      await Promise.all([
        Blog.deleteMany({ author: user._id }),
        Comment.deleteMany({ user: user._id }),
      ]);
  
      // Remove the user using deleteOne
      await User.deleteOne({ _id: user._id });
  
      res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ msg: 'Error deleting user' });
    }
}

  




module.exports = {
  signup,
  login,
  like,
  deleteUser
};
