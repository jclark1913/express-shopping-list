"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const { NotFoundError } = require("../expressError");

const router = new express.Router();
const db = require("../fakeDb");


/** GET /items/ -- returns list of all items in db */
router.get("/", function (req, res, next) {

  const items = db.items;
  res.json({ items });

});

/** POST /items/ -- adds item to db and returns json of new item if successful.
 *  If not successful, throws Bad Request 400 error.
 */
router.post("/", function (req, res, next) {

  if (req.body.name === undefined || req.body.price === undefined) {
    throw new BadRequestError();
  }

  const newItem = { name: req.body.name, price: req.body.price };
  db.items.push(newItem);
  res.json({ added: newItem });

});


/** GET /items/:name -- returns json of item in url params if successful. If
 * not successful, throws Not Found 404 error.
 */
router.get("/:name", function (req, res, next) {
  //
  const currItem = db.items.find(item => item.name === req.params.name);

  if (currItem === undefined) {
    throw new NotFoundError();
  }

  res.json(currItem);

});

/** PATCH /items/:name -- updates an item in the db and returns modified item
 * as json if successful. If not successful, throws Not Found 404 error.
 */
router.patch("/:name", function (req, res, next) {

  // Add error catching

  // .find array method
  const currItem = db.items.find(item => item.name === req.params.name);
  currItem.name = req.body.name;
  currItem.price = req.body.price;

  res.json(currItem);

});

/**DELETE /items/:name -- deletes item from the db and returns
 * {message: "Deleted"} if successful. If not successful, throws Not Found 404
 * error. */



module.exports = router;