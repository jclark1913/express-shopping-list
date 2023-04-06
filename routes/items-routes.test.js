const request = require("supertest");

const app = require("../app");
const db = require("../fakeDb");


beforeEach(function () {
  let popsicle = { name: "popsicle", price: 1.00 };
  db.items.push(popsicle);
});

afterEach(function () {
  db.items.length = 0;
});

/** GET /items -- returns json containing all items: `{items: [name: ...]} */

describe("GET /items", function () {
  it("Returns list of all items", async function () {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({ items: [{ name: "popsicle", price: 1.00 }] });
  });
});


/** POST /items -- adds new item to db and returns json of new item:
 * `{added: { name: ...}}`. Returns 400 error if json incorrect */

describe("POST /items", function () {
  it("Adds a new item to db", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        "name": "sandwich",
        "price": 2.00
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      added:
      {
        name: "sandwich",
        price: 2.00
      }
    });
  });
  it("Throws error if json incorrect", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send("invalid");
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({ error: { message: "Bad Request", status: 400 } });
  });
});

/** GET /items/:name -- returns json about item if successful: {name: ... }
 * or returns 404 if unsuccessful.
*/

describe("GET /items/:name", function () {
  it("Gets data about an item", async function () {
    const resp = await request(app).get(`/items/popsicle`);
    // add actual return json to test
    expect(resp.body).toEqual({ name: "popsicle", price: 1.00 });
  });

  it("Responds with 404 if item doesn't exist", async function () {
    const resp = await request(app).get(`/items/not-item`);

    expect(resp.statusCode).toEqual(404);
    expect(resp.body).toEqual({
      "error": {
        "message": "Not Found",
        "status": 404
      }
    });
  });
});

/** PATCH /items/:name -- returns json of updated item if successful: `{name: ...}
 * else throws a Bad Request error.
*/

describe("PATCH /items/:name", function () {
  it("Updates an existing item", async function () {
    const resp = await request(app)
      .patch(`/items/popsicle`)
      .send({
        name: "updated",
        price: 0
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      name: "updated",
      price: 0
    });
  });

  it("Throws an error if json incorrect", async function () {
    const resp = await request(app)
      .patch(`/items/popsicle`)
      .send("invalid");

    expect(resp.statusCode).toEqual(400);
  });
});

/** DELETE /items/:name test */

describe("DELETE /items/:name", function () {
  it("Deletes an item", async function () {
    console.log(db.items)
    const resp = await request(app)
      .delete(`/items/popsicle`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });

  it("Throws an error if item doesn't exist", async function () {
    const resp = await request(app)
      .delete(`/items/not-item`);

    expect(resp.statusCode).toEqual(404);
    expect(resp.body).toEqual({
      "error": {
        "message": "Not Found",
        "status": 404
      }
    });

  });

});
