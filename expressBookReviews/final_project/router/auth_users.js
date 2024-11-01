const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  return validUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({ message: "Wrong username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.session.username;

  if (!reviewText || !username) {
    return res
      .status(400)
      .json({ message: "Review text or username missing." });
  }

  const existingUserReview = books[isbn].reviews.find(
    (r) => r.username === username
  );

  if (existingUserReview) {
    existingUserReview.review = reviewText;
    res.status(200).json({ message: "Review updated successfully" });
  } else {
    books[isbn].reviews.push({ username: username, review: reviewText });
    res.status(200).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (books[isbn] && books[isbn].reviews) {
    const reviewsCount = books[isbn].reviews.length;
    books[isbn].reviews = books[isbn].reviews.filter(
      (r) => r.username !== username
    );

    if (books[isbn].reviews.length < reviewsCount) {
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found for this user" });
    }
  } else {
    res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
