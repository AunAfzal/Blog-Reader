const Blog = require('../models/blogs');
const Comment = require('../models/comments');
const User = require('../models/users');
 
async function getAllComments(req, res) {
  try {
    const { blogId } = req.params;

    // Find all comments that have the specified blogId
    const comments = await Comment.find({ blog: blogId }).populate('user', 'username');

    // Check if there are no comments with the given blogId
    if (comments.length === 0) {
      return res.status(404).json({ msg: 'No comments found for the blog' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ msg: 'Error fetching comments' });
  }
}

async function addComment(req, res) {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;

    // Find the blog and user based on their ObjectIDs
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog || !user) {
      return res.status(404).json({ msg: 'Blog or user not found' });
    }

    // Create a new comment instance using the Comment model
    const newComment = new Comment({
      content,
      blog: blogId,
      user: userId
    });

    // Save the new comment to the database
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error posting a comment:', error);
    res.status(500).json({ msg: 'Error posting a comment' });
  }
}




async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;

    // Find the comment based on its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId });

    res.status(200).json({ msg: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting a comment:', error);
    res.status(500).json({ msg: 'Error deleting a comment' });
  }
}
async function getAllCommentsByUsername(req, res) {
  try {
    const { userId } = req.query;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find all comments by the user's _id
    const comments = await Comment.find({ user: user._id })
      .populate({
        path: 'blog',
        select: 'title', // Select only the 'title' field of the associated blog
      })
      .populate('user', 'username');

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ msg: 'Error fetching user comments' });
  }
}




module.exports= {
    getAllComments,
    addComment,
    deleteComment,
    getAllCommentsByUsername
}