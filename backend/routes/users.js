const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userChecker = require('../middleware/userChecker');

 
//sigup
router.post('/signup',userChecker.validateUser,userChecker.checkUsernameOrEmailExistence,userController.signup);

//login
router.post('/login',userController.login);

//like a blog
router.post('/:blogId',userController.like);

//delete account
router.delete('/deleteAccount',userController.deleteUser);

module.exports=router;