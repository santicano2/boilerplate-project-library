/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

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
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    let book;

    suiteSetup(function (done) {
      chai
        .request(server)
        .post("/api/books")
        .send({ title: "Test Book for Functional Tests" })
        .end(function (err, res) {
          book = res.body._id;
          done();
        });
    });

    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(res.body, "title", "Book should have a title");
              assert.property(res.body, "_id", "Book should have an _id");
              assert.equal(res.body.title, "test");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.text, "missing required field title");
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
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/1234")
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        // Ensure we have a valid testBookId before running the test
        assert.isNotNull(book, "Test book ID should be set");

        chai
          .request(server)
          .get(`/api/books/${book}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "Response should be an object");
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            assert.equal(res.body._id, book);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          // Ensure we have a valid testBookId before running the test
          assert.isNotNull(book, "Test book ID should be set");

          chai
            .request(server)
            .post(`/api/books/${book}`)
            .send({ comment: "Test comment" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "Response should be an object");
              assert.property(res.body, "comments");
              assert.isArray(res.body.comments);
              assert.include(res.body.comments, "Test comment");
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${book._id}`)
            .send({})
            .end(function (err, res) {
              assert.equal(res.text, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/1234")
            .send({ comment: "test" })
            .end(function (err, res) {
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${book}`)
          .end(function (err, res) {
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/invalidId123")
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
