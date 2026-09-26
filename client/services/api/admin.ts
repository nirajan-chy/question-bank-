import type {
  AdminStats,
  UserStats,
  ContactSubmission,
  ResourceMeta,
  User,
} from "@/types";

import { http, httpUpload, getAuthToken, apiUrl, ApiClientError, withQuery } from "../http";

type AdminResourceRecord = Record<string, unknown>;

export type { AdminResourceRecord };

export type UploadResult = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};

export const admin = {
  stats: () => http<AdminStats>("/admin/stats"),
  userStats: () => http<UserStats>("/admin/user-stats"),
  meta: (resource: string) => http<ResourceMeta>(`/admin/meta/${resource}`),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpUpload<UploadResult>("/admin/upload", formData);
  },

  /** Same endpoint as `upload`, but reports progress — used for large PDFs. */
  uploadWithProgress: (file: File, onProgress?: (percent: number) => void): Promise<UploadResult> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", apiUrl("/admin/upload"));
      const token = getAuthToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        let body: { success: boolean; message?: string; data?: UploadResult; errors?: unknown[] };
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          reject(new ApiClientError(xhr.status, "The server returned an unreadable upload response."));
          return;
        }
        if (xhr.status >= 200 && xhr.status < 300 && body.success && body.data) {
          resolve(body.data);
        } else {
          reject(new ApiClientError(xhr.status, body.message ?? "Upload failed", body.errors ?? []));
        }
      };
      xhr.onerror = () => reject(new ApiClientError(0, "Upload failed — check your network."));
      xhr.ontimeout = () => reject(new ApiClientError(0, "The upload timed out."));

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    }),

  users: (search = "") =>
    http<User[]>(withQuery("/admin/users", { search: search.trim() || undefined })),
  updateUser: (
    id: string,
    patch: Partial<Pick<User, "name" | "role" | "avatar" | "bio">> & { password?: string }
  ) => http<User>(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteUser: (id: string) => http<null>(`/admin/users/${id}`, { method: "DELETE" }),

  list: (resource: string, search = "") =>
    http<AdminResourceRecord[]>(
      withQuery(`/admin/${resource}`, { search: search.trim() || undefined })
    ),
  create: (resource: string, data: AdminResourceRecord) =>
    http<AdminResourceRecord>(`/admin/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (resource: string, id: string, data: AdminResourceRecord) =>
    http<AdminResourceRecord>(`/admin/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (resource: string, id: string) =>
    http<null>(`/admin/${resource}/${id}`, { method: "DELETE" }),
};

export const adminContacts = () => http<ContactSubmission[]>("/admin/contacts");
