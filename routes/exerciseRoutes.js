const express = require("express");
const router = express.Router();
const {
  createExercise,
  getAllExercises,
  getSingleExercise,
  deleteExercise,
} = require("../controllers/exerciseController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/").get(getAllExercises).post(authenticateUser, createExercise);
router
  .route("/:id")
  .get(authenticateUser, getSingleExercise)
  .delete(authenticateUser, authorizePermissions("admin"), deleteExercise);

module.exports = router;
