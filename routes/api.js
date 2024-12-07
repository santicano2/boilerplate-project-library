/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");
const Book = require("../models/Book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({}, "_id title commentcount");
        res.json(books);
      } catch (err) {
        res.status(500).json({ error: "Error retrieving books" });
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        return res.send("missing required field title");
      }

      try {
        const newBook = new Book({
          title: title,
          commentcount: 0,
          comments: [],
        });

        const savedBook = await newBook.save();
        res.status(201).json({
          _id: savedBook._id,
          title: savedBook.title,
        });
      } catch (err) {
        res.status(500).json({ error: "Error creating book" });
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.status(200).send("complete delete successful");
      } catch (err) {
        res.status(500).json({ error: "Error deleting all books" });
      }
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
