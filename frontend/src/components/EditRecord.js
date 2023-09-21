import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UpdateSuccessModal from "./UpdateSuccessModal"; // Импорт компонента UpdateSuccessModal

function EditRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`/api/records/${id}`)
      .then((response) => {
        setRecord(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных записи:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({
      ...record,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    axios
      .put(`/api/records/${id}`, record)
      .then((response) => {
        // setSuccessMessage("Запись успешно обновлена.");
        setSuccessMessage("Запись успешно обновлена.");
        setSuccessModalVisible(true);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Ошибка при обновлении записи:", error);
        setErrorMessage("Ошибка при обновлении записи.");
        setSuccessMessage("");
      });
  };

  return (
    <div>
      <h2>Редактирование записи</h2>
      {/* {successMessage && (
        <div className="success-message">{successMessage}</div>
      )} */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={record.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Номер телефона:</label>
          <input
            type="text"
            name="phone"
            value={record.phone || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={record.email || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Страна:</label>
          <input
            type="text"
            name="country"
            value={record.country || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Штат:</label>
          <input
            type="text"
            name="state"
            value={record.state || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" onClick={handleUpdate}>
          Сохранить изменения
        </button>
      </form>
      {successModalVisible && (
        <UpdateSuccessModal
          message={successMessage}
          onClose={() => setSuccessModalVisible(false)}
        />
      )}
    </div>
  );
}

export default EditRecord;
