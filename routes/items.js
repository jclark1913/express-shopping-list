"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");

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

router.get("/:name", function (req, res, next) {
  // Add error catching if not in items
  const currItem =
});

module.exports = router;