const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({
        username: username,
        password: password,
      });

      res.status(203).json({ message: "User successfully registered." });
    } else {
      res.status(401).json({ message: "User already exists." });
    }

    return res.status(404).json({ message: "Provided data is incorrect." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here

  const fetchedBooks = new Promise((resolve, reject) => {
    setTimeout(() => resolve(JSON.stringify(books)), 3000);
  });

  fetchedBooks.then((data) => {
    return res.status(200).json(data);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const fetchedBook = new Promise((resolve, reject) => {
    setTimeout(() => resolve(JSON.stringify(books[req.params.isbn])), 3000);
  });

  fetchedBook.then((data) => {
    return res.status(200).json(data);
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const fetchedBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      const authorBooks = [];

      bookKeys.forEach((key) => {
        if (books[key].author === req.params.author) {
          authorBooks.push(books[key]);
        }
      });

      if (authorBooks.length > 0) {
        resolve(JSON.stringify(authorBooks));
      } else {
        reject({ message: `No books written by ${req.params.author}` });
      }
    }, 3000);
  });

  fetchedBooks
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const fetchedBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      const titleBooks = [];

      bookKeys.forEach((key) => {
        if (books[key].title === req.params.title) {
          titleBooks.push(books[key]);
        }
      });

      if (titleBooks.length > 0) {
        resolve(JSON.stringify(titleBooks));
      } else {
        reject({ message: `No books titled ${req.params.title}` });
      }
    }, 3000);
  });

  fetchedBooks
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
