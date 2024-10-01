// const Joi = require('joi');

// // Validator schema for creating a post
// exports.createPostSchema = Joi.object({
//     chatHeadingId: Joi.number().integer().required().label('Chat Heading ID'),
//     chatId: Joi.number().integer().required().label('Chat ID'),
//     heading: Joi.string().required().label('Heading'),
//     message: Joi.string().required().label('Message'),
// });

// just started. has a issue with table

const Joi = require('joi');

// Validation for creating a post
exports.createPostSchema = Joi.object({
    heading: Joi.string().required().label('Heading'),
    message: Joi.string().required().label('Message'),
    // If you want to validate the file (image), you can add custom validation here
});

// Validation for creating a reply
exports.createReplySchema = Joi.object({
    chatId: Joi.number().required().label('Chat ID'),
    replyMessage: Joi.string().required().label('Reply Message'),
    replyId: Joi.any().optional()
});
