import Joi from "joi";

export const objectSchema = {
  name: Joi.string()
    .required()
    .pattern(new RegExp("^[A-Za-zа-яёА-ЯЁ]+$"))
    .max(30)
    .messages({
      "string.pattern.base": `Поле должно содержать только буквы`,
      "string.empty": `Поле не должно быть пустым`,
      "string.max": `Максимальное количество символов - {#limit}`,
      "any.required": `Обязательное поле`,
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Неверный формат email",
      "any.required": "Обязательное поле",
    }),

  emailConfirm: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Неверный формат email",
      "any.required": "Обязательное поле",
    }),

  phone: Joi.string()
    .required()
    .pattern(/^\+7 \d{3} \d{3} \d{2} \d{2}$/)
    .messages({
      "string.pattern.base": `Номер телефона должен начинаться с символа '+' и содержать только цифры.`,
      "string.empty": `Поле не должно быть пустым`,
      "any.required": `Обязательное поле`,
    }),
};
