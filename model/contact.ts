import { Schema, SchemaTypes, model } from "mongoose";

import { Contact } from "./types";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
});

const ContactModel = model<Contact>("contact", contactSchema);

export { ContactModel };
