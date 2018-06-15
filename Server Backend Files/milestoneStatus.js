const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  _id: Joi.objectId(),
  escrowId: Joi.string().allow(""),
  name: Joi.string(),
  milestoneId: Joi.string(),
  relativeDays: Joi.number().allow(""),
  tiedTo: Joi.string().allow(""),
  milestoneStatus: Joi.string().allow(""),
  displayOrder: Joi.number(),
  responsible: Joi.string().allow(""),
  code: Joi.string().allow(""),
  description: Joi.string().allow(""),
  isObsolete: Joi.boolean(),
  expectedDate: Joi.string().allow(""),
  completedDate: Joi.string().allow(""),
  documentTypeId: Joi.string().allow(null),
  openDate: Joi.string().allow(""),
  sourceId: Joi.string().allow(""),
  expectedCloseDate: Joi.string().allow(""),
  days: Joi.string().allow(""),
  relativeTo: Joi.string().allow(""),
  responsibleSecurityRoleIds: Joi.array(),
  viewSecurityRoleIds: Joi.array(),
  status: Joi.string(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date()
};

module.exports = Joi.object().keys(schema);
