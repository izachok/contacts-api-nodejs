import Contact from "./types";
import fs from "fs/promises";
import path from "path";

const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await getContactsFromFile();
  return contacts;
};

const getContactById = async (contactId: string) => {
  const contacts: Contact[] = await getContactsFromFile();
  const contact = contacts.find(
    (contact) => contact.id!.toString() === contactId.toString()
  );
  return contact;
};

const addContact = async (contact: Contact) => {
  try {
    const contacts: Contact[] = await getContactsFromFile();
    const newContact = { ...contact, id: uuidv4() };
    contacts.push(newContact);

    await saveContactsToFile(contacts);
    return newContact;
  } catch (error) {
    console.error("Error occured during adding contact: ", error);
    return;
  }
};

const removeContact = async (contactId: string) => {
  try {
    const contacts: Contact[] = await getContactsFromFile();
    const contact = contacts.find(
      (contact) => contact.id!.toString() === contactId.toString()
    );
    if (contact) {
      await saveContactsToFile(
        contacts.filter(
          (contact) => contact.id!.toString() !== contactId.toString()
        )
      );
    }
    return contact;
  } catch (error) {
    console.error("Error occured during adding contact: ", error);
    return;
  }
};

const updateContact = async (contactId: string, body: Partial<Contact>) => {
  try {
    let contacts: Contact[] = await getContactsFromFile();
    let contact = contacts.find(
      (contact) => contact.id!.toString() === contactId.toString()
    );
    if (contact) {
      contact = { ...contact, ...body };
      contacts.forEach((cont, index) => {
        if (cont.id!.toString() === contact!.id?.toString()) {
          contacts[index] = contact!;
        }
      });
    }
    await saveContactsToFile(contacts);
    return contact;
  } catch (error) {
    console.error("Error occured during adding contact: ", error);
    return;
  }
};

async function getContactsFromFile() {
  try {
    const result = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    console.error("Error occured: ", error);
  }
}

async function saveContactsToFile(contacts: any[]) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  } catch (error) {
    console.error("Error occured during saving: ", error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
