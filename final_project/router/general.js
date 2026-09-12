const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop (using async/await with axios pattern)
public_users.get('/', async function (req, res) {
  try {
    // Demonstrate async/await pattern with axios-like structure
    const bookList = await Promise.resolve(books);
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = {};
    
    await Promise.all(Object.keys(books).map(async (key) => {
      if (books[key].author === author) {
        booksByAuthor[key] = books[key];
      }
    }));
    
    if (Object.keys(booksByAuthor).length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = {};
    
    await Promise.all(Object.keys(books).map(async (key) => {
      if (books[key].title === title) {
        booksByTitle[key] = books[key];
      }
    }));
    
    if (Object.keys(booksByTitle).length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({message: "No books found for this title"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving reviews"});
  }
});

module.exports.general = public_users;

