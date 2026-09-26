import { catalog, type SearchResults, type ListOptions, type SubjectScopedOptions } from "./catalog";
import { community } from "./community";
import { publicForms, type ContactPayload } from "./public-forms";
import { auth } from "./auth";
import { admin, adminContacts, type AdminResourceRecord } from "./admin";
import { learn, streamChat, type ChatStreamEvent } from "./learn";

/** Everything the public site reads. */
export const api = { ...catalog, ...community, ...publicForms };

export {
  catalog,
  community,
  publicForms,
  auth,
  admin,
  adminContacts,
  learn,
  streamChat,
};

export type {
  SearchResults,
  ListOptions,
  SubjectScopedOptions,
  ContactPayload,
  AdminResourceRecord,
  ChatStreamEvent,
};
