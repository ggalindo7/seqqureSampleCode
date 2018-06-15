const responses = require("../models/responses");
const milestoneStatusService = require("../services/milestoneStatus.service");
const apiPrefix = "/api/escrowMilestones";

module.exports = {
  readById: readById,
  create: create,
  update: update,
  delete: _delete,
  findMilestones: findMilestones,
  getTemplateById: getTemplateById
};

function findMilestones(req, res) {
  milestoneStatusService
    .findMilestones(req.params.escrowId)
    .then(hackers => {
      const responseModel = new responses.ItemsResponse();
      responseModel.items = hackers;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}
//req.body.escrowId
function getTemplateById(req, res) {
  milestoneStatusService
    .getTemplateById(req.params) // req.body
    .then(hacker => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = hacker;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function readById(req, res) {
  milestoneStatusService
    .readById(req.params.id)
    .then(hacker => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = hacker;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function create(req, res) {
  milestoneStatusService
    .create(req.body)
    .then(id => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = id;
      res
        .status(201)
        .location(`${apiPrefix}/${id}`)
        .json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function update(req, res) {
  milestoneStatusService
    .update(req.params.id, req.model)
    .then(hacker => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function _delete(req, res) {
  milestoneStatusService
    .delete(req.params.id)
    .then(() => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(new responses.ErrorResponse(err));
    });
}
