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

app.post("/api/records", (req, res) => {
  const {
    name,
    phone,
    email,
    country,
    state,
    radioOption,
    agreement,
    newsletter,
  } = req.body;

  const query = `
      INSERT INTO records (name, phone, email, country, state, radio_option, agreement, newsletter)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.run(
    query,
    [name, phone, email, country, state, radioOption, agreement, newsletter],
    function (err) {
      if (err) {
        console.error("Ошибка при создании записи:", err.message);
        res.status(500).json({ error: "Ошибка при создании записи" });
      } else {
        console.log(`Запись успешно создана с ID: ${this.lastID}`);
        res.status(201).json({ message: "Запись успешно создана" });
      }
    }
  );
});

app.get("/api/records/:id", (req, res) => {
  const recordId = req.params.id;

  const query = `
      SELECT * FROM records WHERE id = ?
    `;

  db.get(query, [recordId], (err, row) => {
    if (err) {
      console.error("Ошибка при получении данных записи:", err.message);
      res.status(500).json({ error: "Ошибка при получении данных записи" });
    } else {
      if (!row) {
        res.status(404).json({ error: "Запись не найдена" });
      } else {
        res.status(200).json(row);
      }
    }
  });
});

app.put("/api/records/:id", (req, res) => {
  const recordId = req.params.id;
  const {
    name,
    phone,
    email,
    country,
    state,
    radioOption,
    agreement,
    newsletter,
  } = req.body;

  const query = `
      UPDATE records
      SET name = ?, phone = ?, email = ?, country = ?, state = ?,radio_option = ?, agreement = ?, newsletter = ?
      WHERE id = ?
    `;

  db.run(
    query,
    [
      name,
      phone,
      email,
      country,
      state,
      radioOption,
      agreement,
      newsletter,
      recordId,
    ],
    (err) => {
      if (err) {
        console.error("Ошибка при обновлении записи:", err.message);
        res.status(500).json({ error: "Ошибка при обновлении записи" });
      } else {
        res.status(200).json({ message: "Запись успешно обновлена" });
      }
    }
  );
});

app.delete("/api/records/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM records WHERE id = ?", id, (err) => {
    if (err) {
      console.error("Ошибка при удалении записи:", err.message);
      res.status(500).json({ error: "Ошибка на сервере" });
      return;
    }
    res.json({ message: "Запись успешно удалена" });
  });
});
