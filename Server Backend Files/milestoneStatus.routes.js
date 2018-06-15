const router = require("express").Router();
const hackersController = require("../controllers/milestoneStatus.controller");
const validateBody = require("../filters/validate.body");
const Hacker = require("../models/milestoneStatus");

module.exports = router;

// api routes ===========================================================
router.get("/:escrowId([0-9a-fA-F]{24})", hackersController.findMilestones);
router.get("/:id([0-9a-fA-F]{24})", hackersController.readById);
router.put(
  "/:id([0-9a-fA-F]{24})",
  validateBody(Hacker),
  hackersController.update
);
router.post("/", validateBody(Hacker), hackersController.create);
router.delete("/:id([0-9a-fA-F]{24})", hackersController.delete);
