const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


//post a comment
router.post('/:blogId',commentController.addComment);

//getcomments of a user
router.get('/user-comments', commentController.getAllCommentsByUsername);

//get all comments of a post
router.get('/:blogId',commentController.getAllComments);

//delete a comment
router.delete('/:commentId', commentController.deleteComment);


module.exports=router;