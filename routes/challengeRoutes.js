const express = require("express");
const router = express.Router();
const {
  createChallenge,
  getAllChallenges,
  getMyChallenges,
  getSingleChallenge,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challengeController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
router
  .route("/")
  .post(authenticateUser, createChallenge)
  .get(authenticateUser, authorizePermissions("admin"), getAllChallenges);

router.route("/myChallenges").get(authenticateUser, getMyChallenges);

router
  .route("/:id")
  .get(authenticateUser, getSingleChallenge)
  .patch(authenticateUser, updateChallenge)
  .delete(authenticateUser, deleteChallenge);

module.exports = router;
