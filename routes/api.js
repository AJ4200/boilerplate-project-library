"use strict";

const { ObjectId } = require("mongodb"); // Assuming you're using MongoDB for database operations

module.exports = function (app, db) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        const books = await db.collection("books").find().toArray();
        const response = books.map((book) => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length, // Assuming comments are stored as an array in each book document
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
        const result = await db
          .collection("books")
          .insertOne({ title, comments: [] });
        res.json({ _id: result.insertedId, title });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .delete(async function (req, res) {
      try {
        await db.collection("books").deleteMany({});
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
        const book = await db
          .collection("books")
          .findOne({ _id: ObjectId(id) });
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
        const result = await db
          .collection("books")
          .findOneAndUpdate(
            { _id: ObjectId(id) },
            { $push: { comments: comment } },
            { returnOriginal: false }
          );
        if (!result.value) {
          return res.send("no book exists");
        }
        res.json({
          _id: result.value._id,
          title: result.value.title,
          comments: result.value.comments,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .delete(async function (req, res) {
      const { id } = req.params;
      try {
        const result = await db
          .collection("books")
          .deleteOne({ _id: ObjectId(id) });
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
