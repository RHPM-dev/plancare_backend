// const jwt = require('jsonwebtoken');
// const asyncHandler = require("express-async-handler");
// const { createPostSchema } = require('../validations/createPost-validation'); // Import the validator
// const PostDAO = require('../dao/PostDAO'); // Import the Post DAO

// // Controller for creating a post
// exports.createPost = asyncHandler(async (req, res) => {
//     const userId = req.user.id; // Get the user ID from the request
//     const { chatHeadingId, chatId, heading, message } = req.body; // Destructure request body

//     // Validate incoming request data
//     await createPostSchema.validateAsync(req.body);

//     try {
//         // Call the DAO method to create a post
//         const postId = await PostDAO.createPost(userId, chatHeadingId, chatId, heading, message);
//         res.status(201).json({ message: 'Post created', postId }); // Send success response with post ID
//     } catch (err) {
//         console.error("Error creating post:", err);
//         res.status(500).json({ status: 'error', message: 'An error occurred while creating the post.' });
//     }
// });

// just started. has a issue with table

const { createPostSchema, createReplySchema } = require('../validations/publicForum-validation');
const forumPostDao = require('../dao/publicForum-dao');
const asyncHandler = require("express-async-handler");

// Create a new post
exports.createPost = async (req, res) => {
    try {
        await createPostSchema.validateAsync(req.body); // Validate the request body

        const userId = req.user.id; // Assuming req.user contains authenticated user info
        const { heading, message } = req.body;
        let postimage = null;

        // Check if an image was uploaded
        if (req.file) {
            postimage = req.file.buffer; // Store image in buffer as binary data
        }

        // Call the DAO method to insert the post into the database
        const result = await forumPostDao.createPost(userId, heading, message, postimage);
        res.status(201).json({ message: 'Post created', postId: result.insertId });

    } catch (err) {
        console.error('Error:', err);
        if (err.isJoi) {
            return res.status(400).json({ status: 'error', message: err.details[0].message });
        }
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await forumPostDao.getPosts();

        // Convert postimage from Buffer to Base64 string if it exists
        const formattedPosts = posts.map(post => ({
            ...post,
            postimage: post.postimage ? post.postimage.toString('base64') : null
        }));

        res.status(200).json(formattedPosts);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
};

// Create a reply to a post
exports.createReply = async (req, res) => {
    try {
        await createReplySchema.validateAsync(req.body); // Validate the request body

        const { chatId, replyMessage } = req.body;
        const replyId = req.user.id; // Assuming req.user contains authenticated user info

        // Call the DAO method to insert the reply into the database
        const result = await forumPostDao.createReply(chatId, replyId, replyMessage);
        res.status(201).json({ message: 'Reply created', replyId: result.insertId });

    } catch (err) {
        console.error('Error:', err);
        if (err.isJoi) {
            return res.status(400).json({ status: 'error', message: err.details[0].message });
        }
        res.status(500).json({ error: 'Failed to create reply' });
    }
};

// Get replies for a post
exports.getReplies = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Call the DAO method to get replies for the post
        const replies = await forumPostDao.getReplies(chatId);
        res.status(200).json(replies);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to retrieve replies' });
    }
};
