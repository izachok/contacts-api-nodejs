import * as yup from "yup";

const validationSchema = yup
  .object({
    name: yup
      .string()
      .required()
      .matches(
        /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
        "Name can contain only letters, ', - and space."
      ),
    email: yup.string().required().email(),
    phone: yup
      .string()
      .required()
      .matches(
        /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
        "Phone number should contain only numbers and it also could contain spaces, dash, parenthesis and startts with +"
      ),
    favorite: yup.bool().optional(),
  })
  .defined();

const validationSchemaOptional = yup
  .object({
    name: yup
      .string()
      .notRequired()
      .matches(
        /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
        "Name can contain only letters, ', - and space."
      ),
    email: yup.string().notRequired().email(),
    phone: yup
      .string()
      .notRequired()
      .matches(
        /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
        "Phone number should contain only numbers and it also could contain spaces, dash, parenthesis and startts with +"
      ),
    favorite: yup.bool().optional(),
  })
  .defined();

export { validationSchema, validationSchemaOptional };
