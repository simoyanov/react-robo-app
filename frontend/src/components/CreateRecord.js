import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "./SuccessModal";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
} from "@mui/material";

function CreateRecord() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    state: "",
  });

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showSuccessModal = (message) => {
    setSuccessMessage(message);
    setSuccessModalVisible(true);
  };

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
        // setSuccessMessage("Запись успешно создана.");
        showSuccessModal("Запись успешно создана.");
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
      {/* {successMessage && (
        <div className="success-message">{successMessage}</div>
      )} */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Typography variant="h6">Создать запись</Typography>
          <TextField
            label="Имя"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            // ...
          />

          <TextField
            label="Номер телефона"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            // ...
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            // ...
          />
          <TextField
            label="Страна"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            // ...
          />
          <TextField
            label="Штат"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            // ...
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Создать
          </Button>
        </FormControl>
      </form>
      {successModalVisible && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModalVisible(false)}
        />
      )}
    </div>
  );
}

export default CreateRecord;
