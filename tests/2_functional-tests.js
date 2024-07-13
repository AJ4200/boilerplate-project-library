"use strict";

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        if (res.body.length > 0) {
          assert.property(
            res.body[0],
            "commentcount",
            "Books in array should contain commentcount"
          );
          assert.property(
            res.body[0],
            "title",
            "Books in array should contain title"
          );
          assert.property(
            res.body[0],
            "_id",
            "Books in array should contain _id"
          );
        }
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    let testId;

    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          const title = "Test Book";
          chai
            .request(server)
            .post("/api/books")
            .send({ title })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "_id",
                "Book object should contain _id"
              );
              assert.property(
                res.body,
                "title",
                "Book object should contain title"
              );
              testId = res.body._id; // Save the id for future tests
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                "missing required field title",
                "Response should indicate missing title field"
              );
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            if (res.body.length > 0) {
              assert.property(
                res.body[0],
                "commentcount",
                "Books in array should contain commentcount"
              );
              assert.property(
                res.body[0],
                "title",
                "Books in array should contain title"
              );
              assert.property(
                res.body[0],
                "_id",
                "Books in array should contain _id"
              );
            }
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/12345") // Assuming 12345 is not a valid ObjectId in the database
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.text,
              "no book exists",
              "Response should indicate no book exists for invalid id"
            );
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${testId}`) // Use the previously saved testId from POST test
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(
              res.body,
              "comments",
              "Book object should contain comments"
            );
            assert.property(
              res.body,
              "title",
              "Book object should contain title"
            );
            assert.property(res.body, "_id", "Book object should contain _id");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const comment = "This is a test comment";
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .send({ comment })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "comments",
                "Book object should contain comments"
              );
              assert.property(
                res.body,
                "title",
                "Book object should contain title"
              );
              assert.property(
                res.body,
                "_id",
                "Book object should contain _id"
              );
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                "missing required field comment",
                "Response should indicate missing comment field"
              );
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/12345") // Assuming 12345 is not a valid ObjectId in the database
            .send({ comment: "Test comment" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                "no book exists",
                "Response should indicate no book exists for invalid id"
              );
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${testId}`) // Use the previously saved testId from POST test
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.text,
              "delete successful",
              "Response should indicate delete successful"
            );
            done();
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/12345") // Assuming 12345 is not a valid ObjectId in the database
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.text,
              "no book exists",
              "Response should indicate no book exists for invalid id"
            );
            done();
          });
      });
    });
  });
});
