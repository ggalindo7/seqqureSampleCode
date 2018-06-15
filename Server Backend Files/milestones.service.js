const Hacker = require("../models/milestone");
const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

// Services
const documentTypeService = require("./documentType.service");

function readAll(tenantId, itemsPerPage, currentPage) {
  return conn
    .db()
    .collection("milestones")
    .aggregate([
      { $match: { tenantId: tenantId } },
      { $sort: { displayOrder: 1, name: 1 } },
      { $skip: (currentPage - 1) * itemsPerPage },
      { $limit: itemsPerPage }
    ])
    .toArray()
    .then(items => {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item._id = item._id.toString();
      }
      return items;
    });
}

function readById(id) {
  return conn
    .db()
    .collection("milestones")
    .findOne({ _id: new ObjectId(id) })
    .then(item => {
      item._id = item._id.toString();
      return item;
    });
}

const provision = (tenantId, selectedIds, userId, dTypeResult = null) => {
  const ids = selectedIds.map(id => ObjectId(id));

  return conn
    .db()
    .collection("milestones")
    .aggregate()
    .match({ _id: { $in: ids } })
    .project({
      code: 1,
      name: 1,
      displayOrder: 1,
      description: 1,
      isObsolete: 1,
      responsible: 1,
      documentTypeId: 1,
      responsibleSecurityRoleIds: 1,
      viewSecurityRoleIds: 1,
      tenantId: ObjectId(tenantId),
      createdById: ObjectId(userId),
      modifiedById: ObjectId(userId),
      modifiedDate: new Date(),
      sourceId: "$_id",
      _id: 0
    })
    .toArray()
    .then(docs => {
      // Lookup the tenant's version of each transactionType
      const sourceDTypePromises = [];
      docs.forEach(doc => {
        doc.documentTypeId &&
          sourceDTypePromises.push(
            conn
              .db()
              .collection("documentType")
              .findOne({
                tenantId: ObjectId(tenantId),
                sourceId: doc.documentTypeId
              })
              .then(dType => (dType ? dType._id : null))
          );
      });

      // Once all lookups are complete, check if tenant needs to provision any transactionTypes
      return Promise.all(sourceDTypePromises).then(provisionedIds => {
        // If a lookup failed, record the transactionType that needs to be provisioned
        const dTypesToProvision = provisionedIds
          .map((id, i) => (id ? null : docs[i].documentTypeId))
          .filter(el => el);

        // Provision transactionTypes if needed, than recursively call this provision again
        if (dTypesToProvision.length !== 0) {
          return documentTypeService
            .provision(tenantId, dTypesToProvision, userId)
            .then(result => {
              return provision(tenantId, selectedIds, userId, result);
            });
        }

        // Overwrite the original transactionTypeId with the tenant-version's id
        docs.forEach((doc, i) => {
          doc.documentTypeId = provisionedIds[i];
        });

        // Write to escrowTemplates
        return conn
          .db()
          .collection("milestones")
          .insertMany(docs)
          .then(result => ({
            milestones: {
              insertedCount: result.insertedCount,
              insertedIds: result.insertedIds
            },
            documentTypes: dTypeResult
          }));
      });
    });
};

function create(model) {
  if (model.responsibleSecurityRoleIds) {
    model.responsibleSecurityRoleIds = model.responsibleSecurityRoleIds.map(x =>
      ObjectId(x)
    );
  }
  if (model.viewSecurityRoleIds) {
    model.viewSecurityRoleIds = model.viewSecurityRoleIds.map(x => ObjectId(x));
  }
  if (model.documentTypeId) {
    model.documentTypeId = ObjectId(model.documentTypeId);
  }
  return conn
    .db()
    .collection("milestones")
    .insert(model)
    .then(result => result.insertedIds[0].toString());
}

function update(id, doc) {
  doc._id = new ObjectId(doc._id);
  if (doc.responsibleSecurityRoleIds) {
    doc.responsibleSecurityRoleIds = doc.responsibleSecurityRoleIds.map(x =>
      ObjectId(x)
    );
  }
  if (doc.viewSecurityRoleIds) {
    doc.viewSecurityRoleIds = doc.viewSecurityRoleIds.map(x => ObjectId(x));
  }
  if (doc.documentTypeId) {
    doc.documentTypeId = ObjectId(doc.documentTypeId);
  }

  return conn
    .db()
    .collection("milestones")
    .updateOne({ _id: new ObjectId(id) }, { $set: doc })
    .then(result => Promise.resolve()); // "return" nothing
}

function _delete(id) {
  return conn
    .db()
    .collection("milestones")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve());
}

module.exports = {
  readAll: readAll,
  readById: readById,
  provision,
  create: create,
  update: update,
  delete: _delete
};
