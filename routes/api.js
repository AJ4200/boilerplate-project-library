"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define a schema for the book
const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String], // Array of comments as strings
});

// Create a Mongoose model based on the schema
const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        const books = await Book.find();
        const response = books.map((book) => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        }));
        res.json(response);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .post(async function (req, res) {
      const { title } = req.body;
      if (!title) {
        return res.send("missing required field title");
      }

      try {
        const newBook = new Book({ title, comments: [] });
        await newBook.save();
        res.json({ _id: newBook._id, title });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      const { id } = req.params;
      try {
        const book = await Book.findById(id);
        if (!book) {
          return res.send("no book exists");
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .post(async function (req, res) {
      const { id } = req.params;
      const { comment } = req.body;
      if (!comment) {
        return res.send("missing required field comment");
      }

      try {
        const book = await Book.findById(id);
        if (!book) {
          return res.send("no book exists");
        }

        book.comments.push(comment);
        await book.save();

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .delete(async function (req, res) {
      const { id } = req.params;
      try {
        const result = await Book.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          return res.send("no book exists");
        }
        res.send("delete successful");
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });
};
