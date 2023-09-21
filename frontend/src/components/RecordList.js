import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("/api/records")
      .then((response) => {
        setRecords(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }, []);

  return (
    <div>
      <h2>Список записей</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Номер телефона</th>
            <th>Email</th>
            <th>Страна</th>
            <th>Штат</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.phone}</td>
              <td>{record.email}</td>
              <td>{record.country}</td>
              <td>{record.state}</td>
              <td>
                <Link to={`/edit/${record.id}`}>Редактировать</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecordList;
