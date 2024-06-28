const Blog = require('../models/blogs');
const Comment = require('../models/comments'); 
const User = require('../models/users');
const mongoose = require('mongoose');

async function getAllBlogs(req,res) {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: 1 }).populate('author', 'username');
        if (blogs.length === 0) {
          return res.status(401).json({ msg: 'No blogs found' });
        }
        res.status(200).json(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ msg: 'Error fetching blogs' });
      }
}

async function getLatestBlogs(req,res) {
  try {
      const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate('author', 'username');
      if (blogs.length === 0) {
        return res.status(401).json({ msg: 'No blogs found' });
      }
      res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ msg: 'Error fetching blogs' });
    }
}

async function getPopularBlogs(req,res) {
  try {
      const blogs = await Blog.find({}).sort({ likes: -1 }).populate('author', 'username');
      if (blogs.length === 0) {
        return res.status(401).json({ msg: 'No blogs found' });
      }
      res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ msg: 'Error fetching blogs' });
    }
}

async function addBlog(req, res) {
  try {
    const { title, overview, content, userId, tags } = req.body;
    const views = 0;
    const likes = 0;

    // Find the user based on their userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newBlog = new Blog({
      title,
      overview,
      content,
      author: user._id, // Use the ObjectId directly
      tags,
      views,
      likes,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ msg: 'Error adding blog' });
  }
}



// Get all liked blogs of a user
async function getLikedBlogs(req, res) {
  try {
    const { userId } = req.query;

    // Find the user based on their ObjectID and populate their likedBlogs
    const user = await User.findById(userId).populate({
      path: 'likedBlogs',
      populate: {
        path: 'author',
        select: 'username', // Select only the username field
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user.likedBlogs);
  } catch (error) {
    console.error('Error fetching liked blogs:', error);
    res.status(500).json({ msg: 'Error fetching liked blogs' });
  }
}



// Get a single blog by ID
async function getBlogById(req, res) {
  try {
    const { id } = req.params;

    // Find the blog based on its ObjectID
    const blog = await Blog.findById(id).populate('author', 'username');

    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    blog.views++;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching a blog:', error);
    res.status(500).json({ msg: 'Error fetching a blog' });
  }
}

// Edit a blog by ID
async function editBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, overview, content, tags } = req.body;

    // Find the blog based on its ObjectID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    // Update the blog fields with the new data
    blog.title = title;
    blog.overview = overview;
    blog.content = content;
    blog.tags = tags;

    // Save the updated blog to the database
    const updatedBlog = await blog.save();

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error editing a blog:', error);
    res.status(500).json({ msg: 'Error editing a blog' });
  }
}

// Delete a blog by ID
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    // Find the blog based on its ObjectID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    // Find and remove all comments associated with the blog
    await Comment.deleteMany({ blog: blog._id });

    // Remove the blog from the database
    await Blog.deleteOne({ _id: blog._id });

    res.status(200).json({ msg: 'Blog and associated comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting a blog and associated comments:', error);
    res.status(500).json({ msg: 'Error deleting a blog and associated comments' });
  }
}



async function search(req, res) {
  try {
    const { term } = req.query;

    // Create a regular expression with the search term, using 'i' flag for case-insensitive search
    const regex = new RegExp(term, 'i');

    // Search for blogs with the term in the title, overview, content, or author
    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { overview: regex },
        { content: regex },
      ],
    }).populate('author', 'username');

    // Check if no blogs are found with the given search term
    if (blogs.length === 0) {
      return res.status(404).json({ msg: 'No blogs found matching the search term' });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ msg: 'Error searching blogs' });
  }
}

async function filterBlogsByTags(req, res) {
  try {
    const { blogs, filterTags } = req.body;

    // Filter the blogs based on the filter tags
    const filteredBlogs = blogs.filter((blog) => {
      return blog.tags.some((tag) => filterTags.includes(tag));
    });

    res.status(200).json(filteredBlogs);
  } catch (error) {
    console.error('Error filtering blogs:', error);
    res.status(500).json({ msg: 'Error filtering blogs' });
  }
}

async function getAllBlogsByUsername(req, res) {
  try {
    const { userId } = req.query;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find all blogs by the user's _id
    const blogs = await Blog.find({ author: user._id }).populate('author', 'username');

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ msg: 'Error fetching user blogs' });
  }
}



module.exports= {
    getAllBlogs,
    getLatestBlogs,
    getPopularBlogs,
    addBlog,
    getLikedBlogs, 
    getBlogById,
    editBlog, 
    deleteBlog,
    search,
    filterBlogsByTags,
    getAllBlogsByUsername
}