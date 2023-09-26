import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
  Grid,
} from "@mui/material";
import { List } from "@mui/icons-material";

import { objectSchema } from "../validation";
import InputMask from "react-input-mask";
import { Country, State } from "country-state-city";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    emailConfirm: "",
    country: "",
    state: "",
    radioOption: "",
    agreement: false,
    newsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isStateDisabled, setIsStateDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCountry) {
      const stateData = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(stateData);
    } else {
      setStates([]);
      setSelectedState("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    axios
      .get(`/api/records/${id}`)
      .then((response) => {
        const recordData = response.data;
        setFormData({
          name: recordData.name,
          phone: recordData.phone,
          email: recordData.email,
          emailConfirm: recordData.email,
          country: recordData.country,
          state: recordData.state,
          radioOption: recordData.radio_option,
          agreement: recordData.agreement,
          newsletter: recordData.newsletter,
        });
        setSelectedCountry(
          allCountries.find((country) => country.name === recordData.country)
        );
        if (recordData.state) {
          setSelectedState(recordData.state);
          setIsStateDisabled(false);
        }
      })
      .catch((error) => {
        setErrorMessage("Ошибка при загрузке записи.");
      });
  }, [id]);

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
    if (value) {
      const stateData = State.getStatesOfCountry(value.isoCode);
      setIsStateDisabled(stateData.length === 0);
    } else {
      setIsStateDisabled(true);
    }

    setFormData({
      ...formData,
      country: value ? value.name : "",
    });
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setFormData({
      ...formData,
      state: event.target.value ? event.target.value : "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "name") {
      const { error } = objectSchema.name.validate(value);
      setErrors({
        ...errors,
        [name]: error ? error.message : "",
      });
    }

    if (name === "phone") {
      const { error } = objectSchema.phone.validate(value);
      setErrors({
        ...errors,
        [name]: error ? error.message : "",
      });
    }

    if (name === "email") {
      const { error } = objectSchema.email.validate(value);
      setErrors({
        ...errors,
        [name]: error ? error.message : "",
      });
    }

    if (name === "emailConfirm") {
      const { error } = objectSchema.emailConfirm.validate(value);
      setErrors({
        ...errors,
        [name]: error
          ? error.message
          : value !== formData.email
          ? "Email не совпадает"
          : "",
      });
    }
  };

  useEffect(() => {
    const isFormValid =
      !errors.name &&
      !errors.phone &&
      !errors.email &&
      !errors.emailConfirm &&
      formData.emailConfirm &&
      formData.radioOption &&
      (formData.radioOption !== "license" || formData.agreement);

    setFormValid(isFormValid);
  }, [formData, errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    axios
      .put(`/api/records/${id}`, formData)
      .then((response) => {
        handleSuccessModalOpen();
        setIsSubmitting(false);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage("Ошибка при изменении записи.");
        setIsSubmitting(false);
      });
  };

  const handleSuccessModalOpen = () => {
    setSuccessModalVisible(true);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigate("/", { state: { editedRecordId: id } });
  };

  return (
    <Box
      sx={{
        marginTop: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3, maxWidth: 800, p: 4, boxShadow: 4, borderRadius: 2 }}
      >
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Typography
          sx={{
            marginTop: 2,
            marginBottom: 2,
          }}
          variant="h6"
        >
          Редактировать запись
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputMask
              value={formData.phone}
              onChange={handleChange}
              mask="+7 999 999 99 99"
            >
              {() => (
                <TextField
                  label="Номер телефона"
                  required
                  fullWidth
                  name="phone"
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              )}
            </InputMask>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email confirm"
              name="emailConfirm"
              type="email"
              value={formData.emailConfirm}
              onChange={handleChange}
              required
              error={Boolean(errors.emailConfirm)}
              helperText={errors.emailConfirm}
              disabled={!formData.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={Country.getAllCountries()}
              getOptionLabel={(option) => option.name}
              value={selectedCountry}
              onChange={handleCountryChange}
              renderInput={(params) => <TextField {...params} label="Страна" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Штат</InputLabel>
              <Select
                label="Штат"
                name="state"
                value={selectedState}
                onChange={handleStateChange}
                disabled={isStateDisabled}
              >
                {states.map((state) => (
                  <MenuItem key={state.name} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                name="radioOption"
                value={formData.radioOption}
                onChange={handleChange}
                row
                error={Boolean(errors.radioOption)}
              >
                <FormControlLabel
                  value="license"
                  control={<Radio />}
                  label="По лицензионному соглашению"
                />
                <FormControlLabel
                  value="mutual"
                  control={<Radio />}
                  label="По обоюдному согласию"
                />
              </RadioGroup>
              <div>
                {formData.radioOption === "license" && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="agreement"
                          checked={formData.agreement}
                          onChange={handleChange}
                          required
                        />
                      }
                      label="Принимаю условия лицензионного соглашения"
                      error={Boolean(errors.agreement)}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleChange}
                        />
                      }
                      label="Отправлять мне новости по email"
                    />
                  </FormGroup>
                )}
                {formData.radioOption === "mutual" && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleChange}
                        />
                      }
                      label="Отправлять мне новости по email"
                    />
                  </FormGroup>
                )}
              </div>
              {errors.radioOption && (
                <Typography variant="body2" color="error">
                  {errors.radioOption}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!formValid || isSubmitting}
          >
            Сохранить запись
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<List />}
            component={Link}
            to="/"
          >
            Список записей
          </Button>
        </Box>
      </Box>
      <Dialog open={successModalVisible} onClose={handleSuccessModalClose}>
        <DialogTitle>Запись обновлена успешно</DialogTitle>
        <DialogActions>
          <Button onClick={handleSuccessModalClose} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditRecord;
