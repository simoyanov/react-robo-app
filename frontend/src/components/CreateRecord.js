import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "./SuccessModal";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import {
  nameValidationSchema,
  emailSchema,
  emailConfirmSchema,
  phoneSchema,
} from "../validation";
import InputMask from "react-input-mask";
import { Country, State } from "country-state-city";

function CreateRecord() {
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [stateDisabled, setStateDisabled] = useState(true);
  const [isStateDisabled, setIsStateDisabled] = useState(true);
  const showSuccessModal = (message) => {
    setSuccessMessage(message);
    setSuccessModalVisible(true);
  };

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
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === "name") {
      const nameValidationResult = nameValidationSchema.validate(value);
      if (nameValidationResult.error) {
        setErrors({
          ...errors,
          name: nameValidationResult.error.details[0].message,
        });
        setFormValid(false);
      } else {
        setErrors({
          ...errors,
          name: "",
        });
      }
    }

    if (name === "phone") {
      const { error } = phoneSchema.validate(value);
      setErrors({
        ...errors,
        [name]: error ? error.message : undefined,
      });
    }

    if (name === "email") {
      const emailValidation = emailSchema.validate(value);

      setErrors({
        ...errors,
        [name]: emailValidation.error
          ? emailValidation.error.message
          : undefined,
      });
    }

    if (name === "emailConfirm") {
      const emailConfirmValidation = emailConfirmSchema.validate(value, {
        context: { email: formData.email },
      });

      setErrors({
        ...errors,
        emailConfirm: emailConfirmValidation.error
          ? emailConfirmValidation.error.message
          : undefined,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.name) {
      validationErrors.name = "Обязательное поле";
    }

    if (!formData.phone) {
      validationErrors.phone = "Обязательное поле";
    } else if (!/^\+/.test(formData.phone)) {
      validationErrors.phone = "Номер телефона должен начинаться с +";
    }
    if (!formData.email) {
      validationErrors.email = "Обязательное поле";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.email = "Неверный формат email";
    }
    if (formData.email !== formData.emailConfirm) {
      validationErrors.emailConfirm = "Email не совпадает";
    }
    if (!formData.country) {
      validationErrors.country = "Обязательное поле";
    }
    if (!formData.state) {
      validationErrors.state = "Обязательное поле";
    }

    if (!formData.radioOption) {
      validationErrors.radioOption = "Выберите опцию";
    }

    if (formData.radioOption === "license") {
      if (!formData.agreement) {
        validationErrors.agreement = "Обязательное согласие";
      }
    }

    const nameValidationResult = nameValidationSchema.validate(formData.name);
    if (nameValidationResult.error) {
      validationErrors.name = nameValidationResult.error.details[0].message;
    }

    const emailValidation = emailSchema.validate(formData.email);
    const emailConfirmValidation = emailConfirmSchema.validate(
      formData.emailConfirm
    );

    if (emailValidation.error) {
      validationErrors.email = emailValidation.error.message;
    }

    if (emailConfirmValidation.error) {
      validationErrors.emailConfirm = emailConfirmValidation.error.message;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormValid(false);
      return;
    }

    axios
      .post("/api/records", formData)
      .then((response) => {
        showSuccessModal("Запись успешно создана.");
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

        setErrors({});
        setFormValid(true);
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
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            mask="+7 999 999 99 99"
          >
            {() => <TextField label="Номер телефона" required />}
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
            renderInput={(params) => (
              <TextField {...params} label="Страна" required />
            )}
          />
        </FormControl>
        <FormControl>
          <InputLabel>Штат</InputLabel>
          <Select
            name="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            required
            disabled={isStateDisabled}
          >
            {states.map((state) => (
              <MenuItem key={state.name} value={state.name}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" error={Boolean(errors.radioOption)}>
          <RadioGroup
            name="radioOption"
            value={formData.radioOption}
            onChange={handleChange}
            row
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
