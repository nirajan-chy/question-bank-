import type { ContactSubmission } from "@/types";

import { http } from "../http";

export type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

/** Public write endpoints that need no authentication. */
export const publicForms = {
  /**
   * `POST /api/contact` stores the submission and (when SMTP is configured on
   * the server) emails the owner. No auth required.
   */
  contact: (payload: ContactPayload) =>
    http<ContactSubmission>("/contact", {
      method: "POST",
      body: JSON.stringify({ subject: "", ...payload }),
    }),
};
