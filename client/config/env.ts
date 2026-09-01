const url = process.env.NEXT_PUBLIC_BASE_URL;
if (!url) {
  throw new Error("Missing NEXT_PUBLIC_BASE_URL environment variable");
}
export const BASEURL = url;
