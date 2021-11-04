import httpErrors, { BadRequest, NotFound } from "http-errors";

import Contact from "../model/types";
import { RequestHandler } from "express";
import model from "../model";

const getAll: RequestHandler = async (req, res, next) => {
  const contacts = await model.listContacts();
  res.json(contacts);
};

const getById: RequestHandler = async (req, res, next) => {
  const contact = await model.getContactById(req.params.contactId);
  if (!contact) {
    throw new NotFound("Not found");
  }
  res.json(contact);
};

const add: RequestHandler = async (req, res, next) => {
  const contactFromRequest: Contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const contact = await model.addContact(contactFromRequest);
  if (contact) {
    res.status(201).json(contact);
  }
};

const deleteById: RequestHandler = async (req, res, next) => {
  const contact = await model.removeContact(req.params.contactId);
  if (!contact) {
    throw new NotFound("Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById: RequestHandler = async (req, res, next) => {
  const body: Partial<Contact> = req.body;
  if (Object.keys(body).length == 0) {
    throw new BadRequest("missing fields");
  }
  const contact = await model.updateContact(req.params.contactId, body);
  if (contact) {
    res.status(200).json(contact);
  } else {
    throw new NotFound("Not found");
  }
};

export { getAll, getById, add, deleteById, updateById };
