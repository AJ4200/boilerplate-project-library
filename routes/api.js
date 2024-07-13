"use strict";

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = [
        { _id: 1, title: "Book 1", commentcount: 0 },
        { _id: 2, title: "Book 2", commentcount: 0 },
        { _id: 3, title: "Book 3", commentcount: 0 },
      ];
      res.json(books);
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      let book = { _id: Date.now(), title: title, commentcount: 0 };
      res.json(book);
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      res.json({ message: "complete delete successful" });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = {
        _id: bookid,
        title: "Book " + bookid,
        comments: [],
      };
      res.json(book);
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      let book = {
        _id: bookid,
        title: "Book " + bookid,
        comments: comment ? [comment] : [],
      };
      res.json(book);
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      res.json({ message: "delete successful" });
    });
};
