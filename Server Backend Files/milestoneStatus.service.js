const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;
const moment = require("moment");

module.exports = {
  readById: readById,
  create: create,
  update: update,
  delete: _delete,
  findMilestones: findMilestones,
  getTemplateById: getTemplateById
};

function getTemplateById(info) {
  const templateId = ObjectId(info.templateId);
  const escrowId = ObjectId(info.escrowId);

  //req.body

  return conn
    .db()
    .collection("escrowTemplates")
    .aggregate([
      {
        $match: {
          _id: templateId
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      { $unwind: "$milestones" },
      {
        $lookup: {
          from: "milestones",
          localField: "milestones.milestoneId",
          foreignField: "_id",
          as: "milestoneInfo"
        }
      },
      {
        $unwind: {
          path: "$milestoneInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          escrowId: escrowId,
          milestoneStatus: "New"
        }
      }
    ])
    .toArray()
    .then(array => {
      return conn
        .db()
        .collection("escrowMilestones")
        .insertMany(array)
        .then(result => Object.values(result.insertedIds))
        .catch(error => {
          console.log("Error: ", error);
        });
    });
}

function readById(id) {
  return conn
    .db()
    .collection("escrowMilestones")
    .findOne({ _id: new ObjectId(id) })
    .then(hacker => {
      hacker._id = hacker._id.toString(); // convert ObjectId back to string
      return hacker;
    });
}

function findMilestones(escrowId) {
  const id = new ObjectId(escrowId);
  return conn
    .db()
    .collection("escrowMilestones")
    .aggregate([
      {
        $match: {
          escrowId: id
        }
      }
    ])
    .toArray()
    .then(hackers => {
      for (let i = 0; i < hackers.length; i++) {
        let hacker = hackers[i];
        hacker._id = hacker._id.toString(); // convert ObjectId back to string
      }
      return hackers;
    });
}

function create(model) {
  const viewSecurityRoleObjectIds = model.viewSecurityRoleIds.map(role =>
    ObjectId(role)
  );
  const responsibleSecurityRoleObjectIds = model.responsibleSecurityRoleIds.map(
    role => ObjectId(role)
  );

  let expectedDate = moment().format("YYYY-MM-DD");
  if (model.days || model.days === 0) {
    if (model.relativeTo === "Open") {
      expectedDate = moment(model.openDate)
        .add(model.days, "days")
        .format("YYYY-MM-DD");
    } else {
      expectedDate = moment(model.expectedCloseDate)
        .add(model.days, "days")
        .format("YYYY-MM-DD");
    }
  }

  return (
    conn
      .db()
      .collection("escrowMilestones")
      .insertOne({
        milestoneId: ObjectId(model._id),
        milestoneName: model.name,
        displayOrder: model.displayOrder,
        escrowId: ObjectId(model.escrowId),
        relativeTo: model.relativeTo,
        days: model.days,
        expectedDate: expectedDate,
        actualDate: null,
        status: "New",
        viewSecurityRoleIds: viewSecurityRoleObjectIds,
        responsibleSecurityRoleIds: responsibleSecurityRoleObjectIds,
        tenantId: model.tenantId,
        createdById: model.createdById,
        modifiedById: model.modifiedById,
        createdDate: model.createdDate,
        modifiedDate: model.modifiedDate
      })
      // .then(result => result.insertedIds[0].toString()); // "return" generated Id as string
      .then(result => result.ops)
  );
}

function update(id, doc) {
  doc._id = ObjectId(doc._id);
  const status = doc.status;
  const completedDate = doc.completedDate;

  return conn
    .db()
    .collection("escrowMilestones")
    .updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          status: status,
          actualDate: completedDate
        }
      }
    )
    .then(result => Promise.resolve()); // "return" nothing
}

function _delete(id) {
  return conn
    .db()
    .collection("escrowMilestones")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
}
