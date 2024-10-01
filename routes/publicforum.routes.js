const express = require('express');
const router = express.Router();
const { createPost, getPosts, createReply, getReplies } = require('../Controllers/publicforum.controller');
const auth = require('../Middlewares/auth.middleware');
const upload = require('../Middlewares/multer.middleware');
const publicForumEp = require("../end-point/publicForum-ep");

//router.post('/add/post', auth, upload.single('postimage'), createPost); // Create a new post
//router.get('/get', getPosts); // Get all posts
//router.post('/add/reply', auth, createReply); // Create a new reply
//router.get('/get/:chatId', getReplies); // Get replies for a specific post

router.post('/add/post', auth, upload.single('postimage'), publicForumEp.createPost); // Create a new post
router.get('/get', publicForumEp.getPosts); // Get all posts
router.post('/add/reply', auth, publicForumEp.createReply); // Create a new reply
router.get('/get/:chatId', publicForumEp.getReplies); // Get replies for a specific post



module.exports = router;