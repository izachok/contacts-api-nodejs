import * as yup from "yup";

import Contact from "../model/types";

const validationSchema: yup.SchemaOf<Contact> = yup
  .object({
    id: yup.string().optional(),
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
  })
  .defined();

const validationSchemaOptional: yup.SchemaOf<Partial<Contact>> = yup
  .object({
    id: yup.string().optional(),
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
  })
  .defined();

export { validationSchema, validationSchemaOptional };
