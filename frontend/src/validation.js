import Joi from "joi";

export const nameValidationSchema = Joi.string()
  .required()
  .pattern(new RegExp("^[A-Za-zа-яёА-ЯЁ]+$"))
  .max(255);

export const emailSchema = Joi.string()
  .email({ tlds: { allow: ["com", "net", "org"] } })
  .required();

export const emailConfirmSchema = Joi.string()
  .email({ tlds: { allow: ["com", "net", "org"] } })
  .required()
  .valid(Joi.ref("email"))
  .messages({
    "string.email": "Неверный формат email",
    "any.only": "Email не совпадает",
    "any.required": "Обязательное поле",
  });

export const phoneSchema = Joi.string()
  .required()
  .pattern(new RegExp(/^\+[0-9]+$/))
  .message(
    "Номер телефона должен начинаться с символа '+' и содержать только цифры."
  );
