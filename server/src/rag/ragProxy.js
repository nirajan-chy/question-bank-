const { Readable } = require("node:stream");
const ApiError = require("../utils/ApiError");

const RAG_BASE = process.env.RAG_SERVICE_URL || "http://localhost:8000/rag";
const RAG_SECRET = process.env.RAG_SERVICE_SECRET || "";

function ragHeaders(userId) {
  return {
    "X-User-Id": String(userId),
    "X-Service-Secret": RAG_SECRET,
  };
}

function responseData(body) {
  if (!body.success) {
    throw new ApiError(body.status || 502, body.message || "RAG service error", body.errors || []);
  }
  return body.data;
}

/** Proxy a plain JSON request to the RAG service. */
async function proxyJson(userId, path, method = "GET", payload = undefined, query = "") {
  let response;
  try {
    response = await fetch(`${RAG_BASE}${path}${query}`, {
      method,
      headers: {
        ...ragHeaders(userId),
        ...(payload !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
    });
  } catch {
    throw new ApiError(502, "RAG service is not reachable. Start it with: cd rag && uvicorn app.main:app --port 8000");
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(502, "Unexpected response from the RAG service");
  }

  if (!response.ok) {
    const detail = body?.detail || body?.message || "RAG service error";
    throw new ApiError(response.status, typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  return body.data ?? body;
}

/** Forward a multipart upload to the RAG service. */
async function proxyUpload(userId, path, file, extra = {}) {
  const form = new FormData();
  const blob = new Blob([file.buffer], { type: file.mimetype || "application/octet-stream" });
  form.append("file", blob, file.originalname);

  let response;
  try {
    response = await fetch(`${RAG_BASE}${path}`, {
      method: "POST",
      headers: ragHeaders(userId),
      body: form,
    });
  } catch {
    throw new ApiError(502, "RAG service is not reachable. Start it with: cd rag && uvicorn app.main:app --port 8000");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = body?.detail || body?.message || "RAG service error";
    throw new ApiError(response.status, typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return body.data ?? body;
}

/** Pipe the RAG service SSE stream straight to the client. */
async function proxyStream(req, res, userId, path, payload) {
  let upstream;
  try {
    upstream = await fetch(`${RAG_BASE}${path}`, {
      method: "POST",
      headers: {
        ...ragHeaders(userId),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(502, "RAG service is not reachable. Start it with: cd rag && uvicorn app.main:app --port 8000");
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "RAG service error");
    throw new ApiError(upstream.status, detail || "RAG service error");
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const nodeStream = Readable.fromWeb(upstream.body);
  nodeStream.on("data", (chunk) => res.write(chunk));
  nodeStream.on("end", () => res.end());
  nodeStream.on("error", () => res.end());

  req.on("close", () => nodeStream.destroy());
}

module.exports = {
  proxyJson,
  proxyUpload,
  proxyStream,
  responseData,
};
