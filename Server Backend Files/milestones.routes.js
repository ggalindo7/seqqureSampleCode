const router = require("express").Router();
const milestoneController = require("../controllers/milestones.controller");
const validateBody = require("../filters/validate.body");
const Milestone = require("../models/milestone");
const ProvisionRequest = require("../models/provisionRequest");

module.exports = router;

// api routes ===========================================================
router.get("/", milestoneController.readAll);
router.get("/:id([0-9a-fA-F]{24})", milestoneController.readById);
router.put(
  "/:id([0-9a-fA-F]{24})",
  validateBody(Milestone),
  milestoneController.update
);
router.put(
  "/provision/:tenantId([0-9a-fA-F]{24})",
  validateBody(ProvisionRequest),
  milestoneController.provision
);
router.post("/", validateBody(Milestone), milestoneController.create);
router.delete("/:id([0-9a-fA-F]{24})", milestoneController.delete);
