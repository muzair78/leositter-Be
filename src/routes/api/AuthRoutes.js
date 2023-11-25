const express = require("express");
const router = express.Router();
const AuthRouter = require("../../controller/auth/controller");
const Auth = require("../../middleware/Auth");
const { multerUploadS3 } = require("../../middleware/s3helper");

router.post("/signup", AuthRouter.Signup);
router.post("/signin", AuthRouter.Signin);
router.patch("/jobform/:_id", AuthRouter.UpdateProfile);
router.post("/joinnow/caregiver", AuthRouter.Signup);
router.patch("/caretaker-profile/:_id", Auth, AuthRouter.UpdateProfile);
router.patch(
  "/petsitter-profile/:_id",
  Auth,
  multerUploadS3.any(),
  AuthRouter.UpdateProfile
);
router.patch(
  "/petsitter-profile/password/:_id",
  Auth,
  AuthRouter.UpdatePassword
);
router.patch(
  "/caretaker-profile/password/:_id",
  Auth,
  AuthRouter.UpdatePassword
);

module.exports = router;
