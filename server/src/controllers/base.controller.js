const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const toBoolean = (value) => value === "true" || value === true || value === "1";

/**
 * Factory that generates the standard CRUD + listing controller
 * for a Sequelize model, with configurable filter/order behaviour.
 */
const createBaseController = (Model, config = {}) => {
  const {
    // { field: "subjectSlug" } -> takes the query param value
    // { field: "subjectSlug", param: "subject" } -> custom query param name
    // { field: "featured", boolean: true }
    filters = [],
    order = [],
    // Fields allowed for slug-based lookup
    slugField = "slug",
  } = config;

  const buildWhere = (query) => {
    const where = {};
    for (const filter of filters) {
      const paramName = filter.param || filter.field;
      const value = query[paramName];
      if (value === undefined || value === "") continue;
      if (filter.boolean) {
        if (toBoolean(value)) where[filter.field] = true;
      } else {
        where[filter.field] = value;
      }
    }
    return where;
  };

  const list = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const where = buildWhere(req.query);
    const items = await Model.findAll({
      where,
      order,
      limit: toNumber(limit),
    });
    sendSuccess(res, items);
  });

  const getById = asyncHandler(async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) throw new ApiError(404, `${Model.name} not found`);
    sendSuccess(res, item);
  });

  const getBySlug = asyncHandler(async (req, res) => {
    const item = await Model.findOne({ where: { [slugField]: req.params.slug } });
    if (!item) throw new ApiError(404, `${Model.name} not found`);
    sendSuccess(res, item);
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    sendSuccess(res, item, 201, `${Model.name} created`);
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) throw new ApiError(404, `${Model.name} not found`);
    const { id, createdAt, updatedAt, ...patch } = req.body;
    const updated = await item.update(patch);
    sendSuccess(res, updated, 200, `${Model.name} updated`);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) throw new ApiError(404, `${Model.name} not found`);
    await item.destroy();
    sendSuccess(res, null, 200, `${Model.name} deleted`);
  });

  return { list, getById, getBySlug, create, update, remove, buildWhere, toNumber };
};

module.exports = { createBaseController, toNumber, toBoolean };
