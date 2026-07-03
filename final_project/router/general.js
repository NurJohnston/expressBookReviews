const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const axios = require("axios");

const public_users = express.Router();


// Register new user
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Unable to register user."
        });
    }

    if (!isValid(username)) {
        return res.status(404).json({
            message: "User already exists."
        });
    }

    users.push({
        username,
        password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login."
    });

});


// Get all books
public_users.get("/", async (req, res) => {

    return res.status(200).json(books);

});


// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});


// Get books by author
public_users.get("/author/:author", async (req, res) => {

    const author = req.params.author;

    const filteredBooks = Object.entries(books).filter(
        ([isbn, book]) => book.author === author
    );

    return res.status(200).json(filteredBooks);

});


// Get books by title
public_users.get("/title/:title", async (req, res) => {

    const title = req.params.title;

    const filteredBooks = Object.entries(books).filter(
        ([isbn, book]) => book.title === title
    );

    return res.status(200).json(filteredBooks);

});


// Get reviews
public_users.get("/review/:isbn", async (req, res) => {

    const isbn = req.params.isbn;

    return res.status(200).json(
        books[isbn].reviews
    );

});

module.exports.general = public_users;