import type {
  AdminStats,
  UserStats,
  ContactSubmission,
  ResourceMeta,
  User,
} from "@/types";

import { http, httpUpload, getAuthToken, BASE_URL, ApiClientError } from "../http";

type AdminResourceRecord = Record<string, unknown>;

export type { AdminResourceRecord };

const LOCAL = "/api/admin";

export const admin = {
  stats: () =>
    Promise.resolve({
      totalUsers: 0,
      totalLevels: 0,
      totalUniversities: 0,
      totalFaculties: 0,
      totalCourses: 0,
      totalSubjects: 0,
      totalNotes: 0,
      totalBooks: 0,
      totalQuestionBanks: 0,
      totalPastPapers: 0,
      totalMockTests: 0,
      totalScholarships: 0,
      totalNotices: 0,
      totalResults: 0,
      totalFaq: 0,
      totalPosts: 0,
      totalCommunity: 0,
      totalLeaderboard: 0,
      recentContacts: [],
      recentCommunity: [],
    } as AdminStats),

  userStats: () =>
    Promise.resolve({
      totalUsers: 0,
      active24h: 0,
      active7d: 0,
      active30d: 0,
      newThisWeek: 0,
      newThisMonth: 0,
      roleBreakdown: { admin: 0, user: 0 },
      growth: [],
      dailySignups: [],
      hourlyDistribution: [],
      peakHour: 0,
      newestUser: null,
      oldestUser: null,
    } as UserStats),

  meta: (resource: string) =>
    Promise.resolve({ model: resource, attributes: [] } as ResourceMeta),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpUpload<{ url: string; filename: string; size: number; mimeType: string }>(
      "/admin/upload",
      formData
    );
  },

  uploadWithProgress: (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; filename: string; size: number; mimeType: string }> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/admin/upload`);
      const token = getAuthToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        let body: { success: boolean; message?: string; data?: unknown; errors?: unknown[] };
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          reject(new ApiClientError(xhr.status, "Unexpected upload response"));
          return;
        }
        if (xhr.status >= 200 && xhr.status < 300 && body.success) {
          resolve(body.data as { url: string; filename: string; size: number; mimeType: string });
        } else {
          reject(new ApiClientError(xhr.status, body.message ?? "Upload failed", body.errors ?? []));
        }
      };
      xhr.onerror = () => reject(new ApiClientError(0, "Upload failed — check your network"));
      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    }),

  users: () => Promise.resolve([] as User[]),

  updateUser: (id: string, patch: Partial<Pick<User, "name" | "role" | "avatar" | "bio">> & { password?: string }) =>
    http<User>(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(patch) }),

  deleteUser: (id: string) =>
    http<null>(`/admin/users/${id}`, { method: "DELETE" }),

  list: (resource: string, search = "") => {
    const qs = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    return http<AdminResourceRecord[]>(`${LOCAL}/${resource}${qs}`);
  },

  create: (resource: string, data: AdminResourceRecord) =>
    http<AdminResourceRecord>(`${LOCAL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (resource: string, id: string, data: AdminResourceRecord) =>
    http<AdminResourceRecord>(`${LOCAL}/${resource}?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (resource: string, id: string) =>
    http<null>(`${LOCAL}/${resource}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export const adminContacts = () => Promise.resolve([] as ContactSubmission[]);
