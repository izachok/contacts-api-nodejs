import { BadRequest, Forbidden, NotFound } from "http-errors";
import { ObjectId, Schema } from "mongoose";

import { Contact } from "../model/types";
import { ContactModel } from "../model/contact";
import { ParsedUrlQuery } from "querystring";
import { RequestHandler } from "express";

var mongoose = require("mongoose");

const checkRights = (
  userId: Schema.Types.ObjectId,
  contact: Contact | null
) => {
  //only owner could change contact
  if (!contact) {
    throw new NotFound("Not found");
  }
  if (String(contact.owner) !== String(userId)) {
    throw new Forbidden("Only owner could make changes in contact");
  }
};

interface QueryObject {
  query: {
    owner: ObjectId;
    favorite?: boolean;
  };
  page: number;

  limit: number;
}

const constructQueryObject = (query: any, userId: ObjectId) => {
  const queryObject: QueryObject = {
    query: {
      owner: userId,
    },
    page: 1,
    limit: 20,
  };
  let limit = parseInt(query.limit);
  queryObject.limit =
    isNaN(limit) || limit > queryObject.limit ? queryObject.limit : limit;

  let pageNum = parseInt(query.page);
  queryObject.page = isNaN(pageNum) ? 1 : pageNum;

  let favorite: boolean | undefined = undefined;
  if (query.favorite) {
    favorite = query.favorite === "true";
    queryObject.query.favorite = favorite;
  }

  return queryObject;
};

const getAll: RequestHandler = async (req, res, next) => {
  const { _id } = req.user!;
  const queryObject = constructQueryObject(req.query, _id!);

  const contacts = await ContactModel.find(queryObject.query)
    .skip(queryObject.limit * (queryObject.page - 1))
    .limit(queryObject.limit)
    .populate("owner", "email");
  res.json(contacts);
};

const getById: RequestHandler = async (req, res, next) => {
  const result = await ContactModel.findById(req.params.contactId).populate(
    "owner",
    "email"
  );
  if (!result) {
    throw new NotFound("Not found");
  }
  res.json(result);
};

const add: RequestHandler = async (req, res, next) => {
  const { _id } = req.user!;
  const contactFromRequest: Contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite ?? false,
    owner: _id!,
  };

  const result = await ContactModel.create(contactFromRequest);
  if (result) {
    res.status(201).json(result);
  }
};

const deleteById: RequestHandler = async (req, res, next) => {
  const { _id: userId } = req.user!;
  const contact = await ContactModel.findById(req.params.contactId);
  checkRights(userId!, contact);

  if (!contact) {
    throw new NotFound("Not found");
  }
  if (String(contact.owner) !== String(userId)) {
    throw new Forbidden("Only owner could delete contact");
  }
  await contact.deleteOne();
  res.json({ message: "contact deleted" });
};

const updateById: RequestHandler = async (req, res, next) => {
  const body: Partial<Contact> = req.body;
  if (Object.keys(body).length == 0) {
    throw new BadRequest("missing fields");
  }

  const { _id: userId } = req.user!;
  const contact = await ContactModel.findById(req.params.contactId);
  checkRights(userId!, contact);

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

  const { _id: userId } = req.user!;
  const contact = await ContactModel.findById(contactId);
  checkRights(userId!, contact);

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
