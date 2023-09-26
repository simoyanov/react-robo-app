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
import { useNavigate, Link } from "react-router-dom";

function CreateRecord() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: localStorage.getItem("name") || "",
    phone: localStorage.getItem("phone") || "",
    email: localStorage.getItem("email") || "",
    emailConfirm: localStorage.getItem("emailConfirm") || "",
    country: localStorage.getItem("country") || "",
    state: localStorage.getItem("state") || "",
    radioOption: localStorage.getItem("radioOption") || "",
    agreement: localStorage.getItem("agreement") || false,
    newsletter: localStorage.getItem("newsletter") || false,
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
  const [createdRecordId, setCreatedRecordId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    const savedCountry = localStorage.getItem("country");
    const savedState = localStorage.getItem("state");
    if (savedCountry) {
      setSelectedCountry(
        allCountries.find((country) => country.name === savedCountry)
      );
      if (savedState) {
        setIsStateDisabled(false);
        setSelectedState(savedState);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const stateData = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(stateData);
    } else {
      setStates([]);
      setSelectedState("");
    }
  }, [selectedCountry]);

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
    if (value) {
      const stateData = State.getStatesOfCountry(value.isoCode);
      setIsStateDisabled(stateData.length === 0);
    } else {
      setIsStateDisabled(true);
    }

    localStorage.setItem("country", value.name);
    setFormData({
      ...formData,
      country: value ? value.name : "",
    });
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    localStorage.setItem("state", event.target.value);

    setFormData({
      ...formData,
      state: event.target.value ? event.target.value : "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    localStorage.setItem(name, value);

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
      formData.radioOption &&
      (formData.radioOption !== "license" || formData.agreement);

    setFormValid(isFormValid);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    axios
      .post("/api/records", formData)
      .then((response) => {
        setCreatedRecordId(response.data.id);
        handleSuccessModalOpen();
        setIsSubmitting(false);
        setErrorMessage("");
        localStorage.removeItem("name");
        localStorage.removeItem("phone");
        localStorage.removeItem("email");
        localStorage.removeItem("emailConfirm");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("radioOption");
        localStorage.removeItem("agreement");
        localStorage.removeItem("newsletter");
        setFormData({
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
        setSelectedCountry(null);
        setSelectedState("");
        setIsStateDisabled(true);
        setErrors({});
        setFormValid(true);
      })
      .catch((error) => {
        setErrorMessage("Ошибка при создании записи.");
        setIsSubmitting(false);
      });
  };

  const handleSuccessModalOpen = () => {
    setSuccessModalVisible(true);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    setCreatedRecordId(null);
  };

  const handleSetCreatedRecord = () => {
    navigate("/", { state: { editedRecordId: createdRecordId } });
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
          Создать запись
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
            Создать запись
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
        <DialogTitle>Запись создана успешно</DialogTitle>
        <DialogActions>
          <Button onClick={handleSetCreatedRecord} color="primary">
            Перейти к списку записей
          </Button>
          <Button onClick={handleSuccessModalClose} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CreateRecord;
