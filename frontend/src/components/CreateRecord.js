import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  FormGroup,
  FormLabel,
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
  DialogContent,
  DialogActions,
} from "@mui/material";
import { objectSchema } from "../validation";
import InputMask from "react-input-mask";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";

function CreateRecord() {
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
  const [createdRecordId, setCreatedRecordId] = useState(null);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
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
      formData.radioOption &&
      (formData.radioOption !== "license" || formData.agreement);

    setFormValid(isFormValid);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/records", formData)
      .then((response) => {
        setCreatedRecordId(response.data.id);
        handleSuccessModalOpen();
        setErrorMessage("");
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
    <div>
      <h2>Создание записи</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Создать запись</Typography>

        <FormControl>
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
        </FormControl>
        <FormControl>
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
        </FormControl>
        <FormControl>
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
        </FormControl>
        <FormControl>
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
        </FormControl>
        <FormControl>
          <Autocomplete
            options={Country.getAllCountries()}
            getOptionLabel={(option) => option.name}
            value={selectedCountry}
            onChange={handleCountryChange}
            renderInput={(params) => <TextField {...params} label="Страна" />}
          />
        </FormControl>
        <FormControl>
          <InputLabel>Штат</InputLabel>
          <Select
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
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={!formValid}
        >
          Создать запись
        </Button>
      </form>
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
    </div>
  );
}

export default CreateRecord;
