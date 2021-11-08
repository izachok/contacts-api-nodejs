import * as yup from "yup";

const validationSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })
  .defined();

export { validationSchema };
