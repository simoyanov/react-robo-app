import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UpdateSuccessModal from "./UpdateSuccessModal";
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
        <FormControl>
          <TextField
            fullWidth
            label="Имя"
            name="name"
            value={record.name || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Номер телефона"
            name="phone"
            value={record.phone || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={record.email || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Страна"
            name="country"
            value={record.country || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Штат"
            name="state"
            value={record.state || ""}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Сохранить изменения
          </Button>
        </FormControl>
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
