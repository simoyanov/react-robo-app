// frontend/src/App.js

import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("/api/records") // Это URL, который будет проксирован к серверу Express
      .then((response) => {
        setRecords(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Список записей</h1>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            {record.name} - {record.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
