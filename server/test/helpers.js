"use strict";

function makeRes() {
  const res = {
    _status: 200,
    _body: undefined,
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      this._body = body;
    },
  };
  return res;
}

/**
 * Invokes an asyncHandler-wrapped controller with a fake req/res.
 * The handler resolves when res.json() is called or when it calls next(err).
 */
async function settle(handler, req) {
  const res = makeRes();
  let err;
  handler(req, res, (e) => {
    err = e;
  });

  for (let i = 0; i < 100 && res._body === undefined && !err; i++) {
    await new Promise((resolve) => setImmediate(resolve));
  }

  if (err) throw err;
  return res;
}

module.exports = { makeRes, settle };
