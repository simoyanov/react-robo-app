const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Привет, мир!");
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("myDatabase.db");

app.get("/api/records", (req, res) => {
  db.all("SELECT * FROM records", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Ошибка при запросе данных" });
    } else {
      res.json(rows);
    }
  });
});
