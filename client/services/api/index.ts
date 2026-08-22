import { catalog, stats, withQuery, type SearchResults } from "./catalog";
import { community } from "./community";
import { auth } from "./auth";
import { admin, adminContacts, type AdminResourceRecord } from "./admin";
import { learn, streamChat, type ChatStreamEvent } from "./learn";

export const api = { ...catalog, ...community };

export {
  stats,
  auth,
  admin,
  adminContacts,
  learn,
  streamChat,
  withQuery,
};

export type {
  SearchResults,
  AdminResourceRecord,
  ChatStreamEvent,
};
