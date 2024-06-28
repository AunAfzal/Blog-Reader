const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const blogChecker = require('../middleware/blogChecker');
 

//all blogs
router.get('/',blogController.getAllBlogs);

//popular blogs
router.get('/popular',blogController.getPopularBlogs);

//latest blogs
router.get('/latest',blogController.getLatestBlogs);

//search related blogs
router.get('/search',blogController.search);

//blogs all liked blogs
router.get('/liked',blogController.getLikedBlogs);

//get blogs of a user
router.get('/myBlogs',blogController.getAllBlogsByUsername);

//add a blog
router.post('/',blogController.addBlog);
 
//get 1 blog
router.get('/:id',blogController.getBlogById);

//edit a blog
router.patch('/:id',blogController.editBlog);

//delete a blog
router.delete('/:id',blogController.deleteBlog);

//filter blogs
router.post('/filter', blogController.filterBlogsByTags);




module.exports=router;