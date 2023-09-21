import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Импорт компонента DeleteConfirmationModal

function RecordList() {
  const [records, setRecords] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

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

  const updateRecordList = () => {
    axios.get("/api/records").then((response) => {
      setRecords(response.data);
    });
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      axios
        .delete(`/api/records/${recordToDelete.id}`)
        .then(() => {
          updateRecordList();
          setRecordToDelete(null);
          setDeleteModalVisible(false);
        })
        .catch((error) => {
          console.error("Ошибка при удалении данных:", error);
        });
    }
  };

  const cancelDelete = () => {
    setRecordToDelete(null);
    setDeleteModalVisible(false);
  };

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
              <td>
                <button onClick={() => handleDelete(record)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Модальное окно подтверждения удаления */}
      {deleteModalVisible && (
        <DeleteConfirmationModal
          message={`Вы действительно хотите удалить запись "${recordToDelete.name}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default RecordList;
