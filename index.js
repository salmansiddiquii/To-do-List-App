import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "salman",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    let result = await db.query("SELECT * FROM items ORDER BY id ASC");
    let date = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;
    let item = result.rows;
    res.render("index.ejs", {
      listTitle: date,
      listItems: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/edit", async (req, res) => {
  const updatedItem = req.body.updatedItemTitle;
  const UpdatedId = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [
      updatedItem,
      UpdatedId,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
