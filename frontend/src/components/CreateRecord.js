import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CreateRecord() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    state: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/records", formData)
      .then((response) => {
        setSuccessMessage("Запись успешно создана.");
        setErrorMessage("");
        setFormData({
          name: "",
          phone: "",
          email: "",
          country: "",
          state: "",
        });
      })
      .catch((error) => {
        setErrorMessage("Ошибка при создании записи.");
        setSuccessMessage("");
      });
  };

  return (
    <div>
      <h2>Создание записи</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Номер телефона:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Страна:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Штат:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Создать запись</button>
      </form>
    </div>
  );
}

export default CreateRecord;
