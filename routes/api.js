"use strict";

let books = [
  { _id: 1, title: "Book 1", commentcount: 0, comments: [] },
  { _id: 2, title: "Book 2", commentcount: 0, comments: [] },
  { _id: 3, title: "Book 3", commentcount: 0, comments: [] },
];

let currentId = 3;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      res.json(
        books.map((book) => ({
          _id: book._id,
          title: book.title,
          commentcount: book.commentcount,
        }))
      );
    })
    .post(function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res
          .status(400)
          .json({ message: "missing required field title" });
      }
      let newBook = {
        _id: ++currentId,
        title: title,
        commentcount: 0,
        comments: [],
      };
      books.push(newBook);
      res.json(newBook);
    })
    .delete(function (req, res) {
      books = [];
      res.json({ message: "complete delete successful" });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let book = books.find((b) => b._id === parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ message: "no book exists" });
      }
      res.json(book);
    })
    .post(function (req, res) {
      let book = books.find((b) => b._id === parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ message: "no book exists" });
      }
      let comment = req.body.comment;
      if (!comment) {
        return res
          .status(400)
          .json({ message: "missing required field comment" });
      }
      book.comments.push(comment);
      book.commentcount++;
      res.json(book);
    })
    .delete(function (req, res) {
      let index = books.findIndex((b) => b._id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ message: "no book exists" });
      }
      books.splice(index, 1);
      res.json({ message: "delete successful" });
    });
};
