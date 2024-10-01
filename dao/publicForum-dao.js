// const db = require('../startup/database'); // Ensure to import your database connection

// exports.createPost = (userId, chatHeadingId, chatId, heading, message) => {
//     return new Promise((resolve, reject) => {
//         const sql = 'INSERT INTO publicforumposts (userId, chatHeadingId, chatId, heading, message) VALUES (?, ?, ?, ?, ?)';
//         db.query(sql, [userId, chatHeadingId, chatId, heading, message], (err, result) => {
//             if (err) {
//                 return reject(err); // Reject on error
//             }
//             resolve(result.insertId); // Resolve with the ID of the newly created post
//         });
//     });
// };


// just started. has a issue with table

const db = require('../startup/database');

// DAO method to create a new post
exports.createPost = (userId, heading, message, postimage) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO publicforumposts (userId, heading, message, postimage) VALUES (?, ?, ?, ?)';
        db.query(sql, [userId, heading, message, postimage], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// DAO method to fetch all posts
exports.getPosts = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
            p.id,
            p.userId,
            p.heading,
            p.message,
            p.postimage,         -- Include the postimage field
            p.createdAt,
            COUNT(r.replyId) AS replyCount 
        FROM 
            publicforumposts p 
        LEFT JOIN 
            publicforumreplies r ON p.id = r.chatId 
        GROUP BY 
            p.id, p.userId, p.heading, p.message, p.postimage, p.createdAt  -- Include all selected columns
        ORDER BY 
            p.createdAt DESC
        `;
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// DAO method to create a reply
exports.createReply = (chatId, replyId, replyMessage) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO publicforumreplies (chatId, replyId, replyMessage) VALUES (?, ?, ?)';
        db.query(sql, [chatId, replyId, replyMessage], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// DAO method to get replies for a post
exports.getReplies = (chatId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                r.replyId, 
                r.replyMessage, 
                r.createdAt, 
                u.firstName AS userName 
            FROM 
                publicforumreplies r
            JOIN 
                publicforumposts p ON r.chatId = p.id  
            JOIN 
                users u ON p.userId = u.id  
            WHERE 
                r.chatId = ? 
            ORDER BY 
                r.createdAt DESC
        `;
        db.query(sql, [chatId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
