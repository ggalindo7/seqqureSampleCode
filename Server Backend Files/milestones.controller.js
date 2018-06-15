const responses = require("../models/responses");
const milestoneService = require("../services/milestones.service");
const apiPrefix = "/api/milestones";

function readAll(req, res) {
  let itemsPerPage = parseInt(req.query.itemsPerPage);
  let currentPage = parseInt(req.query.currentPage);
  itemsPerPage = Number.isInteger(itemsPerPage) ? itemsPerPage : 1000;
  currentPage = Number.isInteger(currentPage) ? currentPage : 1;

  milestoneService
    .readAll(req.body.tenantId, itemsPerPage, currentPage)
    .then(items => {
      const responseModel = new responses.ItemsResponse();
      responseModel.items = items;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function readById(req, res) {
  milestoneService
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

const provision = (req, res) => {
  milestoneService
    .provision(
      req.params.tenantId,
      req.model.selectedIds,
      req.session.passport.user._id
    )
    .then(result => {
      res.status(201).json(new responses.ItemResponse(result));
    })
    .catch(err => {
      console.log(err);
      if (typeof err === "object" && Object.keys(err).length === 0) {
        err = "Mongo Error";
      }
      res.status(500).json(new responses.ErrorResponse(err));
    });
};

function create(req, res) {
  milestoneService
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
  milestoneService
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
  milestoneService
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

module.exports = {
  readAll: readAll,
  readById: readById,
  provision,
  create: create,
  update: update,
  delete: _delete
};
