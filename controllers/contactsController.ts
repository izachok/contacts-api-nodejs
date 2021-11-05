import httpErrors, { BadRequest, NotFound } from "http-errors";

import Contact from "../model/types";
import { ContactModel } from "../model/contact";
import { RequestHandler } from "express";

const getAll: RequestHandler = async (req, res, next) => {
  const contacts = await ContactModel.find({});
  res.json(contacts);
};

const getById: RequestHandler = async (req, res, next) => {
  const result = await ContactModel.findById(req.params.contactId);
  if (!result) {
    throw new NotFound("Not found");
  }
  res.json(result);
};

const add: RequestHandler = async (req, res, next) => {
  const contactFromRequest: Contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite ?? false,
  };

  const result = await ContactModel.create(contactFromRequest);
  if (result) {
    res.status(201).json(result);
  }
};

const deleteById: RequestHandler = async (req, res, next) => {
  const result = await ContactModel.findByIdAndRemove(req.params.contactId);
  if (!result) {
    throw new NotFound("Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById: RequestHandler = async (req, res, next) => {
  const body: Partial<Contact> = req.body;
  if (Object.keys(body).length == 0) {
    throw new BadRequest("missing fields");
  }
  const result = await ContactModel.findByIdAndUpdate(
    req.params.contactId,
    body,
    {
      new: true,
    }
  );
  if (result) {
    res.status(200).json(result);
  } else {
    throw new NotFound("Not found");
  }
};

const updateStatusContact: RequestHandler = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (favorite == undefined) {
    throw new BadRequest("missing field favorite");
  }

  const result = await ContactModel.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  if (result) {
    res.status(200).json(result);
  } else {
    throw new NotFound("Not found");
  }
};

export { getAll, getById, add, deleteById, updateById, updateStatusContact };
