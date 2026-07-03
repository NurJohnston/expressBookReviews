const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(
        (user) =>
            user.username === username &&
            user.password === password
    );
};

// Login
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({
            message: "Missing username or password"
        });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            {
                data: password
            },
            "fingerprint_customer",
            {
                expiresIn: "1h"
            }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({
            message: "User successfully logged in"
        });
    }

    return res.status(208).json({
        message: "Invalid Login. Check username and password"
    });

});

// Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const review = req.query.review;

    const username = req.session.authorization.username;

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully"
    });

});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const username = req.session.authorization.username;

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully"
    });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;