const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  name: Joi.string().required(),
  _id: Joi.objectId(),
  code: Joi.string(),
  displayOrder: Joi.number(),
  description: Joi.string(),
  isObsolete: Joi.boolean(),
  responsible: Joi.string().allow(""),
  documentTypeId: Joi.string().allow(""),
  responsibleSecurityRoleIds: Joi.array(),
  viewSecurityRoleIds: Joi.array(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date()
};

module.exports = Joi.object().keys(schema);
