import * as yup from "yup";

import httpErrors, { BadRequest, NotFound } from "http-errors";

import Contact from "../../model/types";
import { error } from "console";
import express from "express";
import model from "../../model/index";

const router = express.Router();

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

router.get("/", async (req, res, next) => {
  try {
    const contacts = await model.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await model.getContactById(req.params.contactId);
    if (!contact) {
      throw new NotFound("Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const contactFromRequest: Contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    await validationSchema.validate(contactFromRequest, { abortEarly: false });
    const contact = await model.addContact(contactFromRequest);
    if (contact) {
      res.status(201);
      res.json(contact);
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      error = new BadRequest(error.errors.join(", "));
    }
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await model.removeContact(req.params.contactId);
    if (!contact) {
      throw new NotFound("Not found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const body: Partial<Contact> = req.body;
    if (Object.keys(body).length == 0) {
      throw new BadRequest("missing fields");
    }

    await validationSchemaOptional.validate(body, {
      abortEarly: false,
    });
    const contact = await model.updateContact(req.params.contactId, body);
    if (contact) {
      res.status(200);
      res.json(contact);
    } else {
      throw new NotFound("Not found");
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      error = new BadRequest(error.errors.join(", "));
    }
    next(error);
  }
});

module.exports = router;
