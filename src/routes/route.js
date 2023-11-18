const express = require("express");
const router = express();
const AuthRouter = require("../authentication/auth");
const Auth = require("../middleware/Auth");

router.post("/signup", AuthRouter.Signup);
router.post("/signin", AuthRouter.Signin);
router.patch("/jobform/:_id", AuthRouter.jobForm);
router.get("/sitters/:service", AuthRouter.SitterNearMe);
router.get("/caregiver/petSitters/:service", AuthRouter.Sitters);
router.post("/joinnow/caregiver", AuthRouter.Careiver);
router.get("/caregiver/:service", AuthRouter.CaregiverData);
router.get("/petSitter/:_id", AuthRouter.PetSitterAdmin);
router.get(
  "/caretaker/caretakerdata/people/:service",
  AuthRouter.CaregiverData
);
router.get("/caretaker-profile/:_id", AuthRouter.CareTakerProfile);
router.get("/petsitter-profile/:_id", AuthRouter.PetSitterProfile);
router.patch(
  "/caretaker-profile/:_id",
  Auth,
  AuthRouter.UpdateCareTakerProfile
);
router.patch(
  "/petsitter-profile/:_id",
  Auth,
  AuthRouter.UpdatePetSitterProfile
);
router.patch(
  "/petsitter-profile/password/:_id",
  Auth,
  AuthRouter.UpdatePetSitterPassword
);
router.patch(
  "/caretaker-profile/password/:_id",
  Auth,
  AuthRouter.UpdateCareTakerPassword
);
router.post(
  "/send-messages/:sender_ID/:reciever_ID",
  Auth,
  AuthRouter.SendMessage
);
router.get("/getmessage/:senderid/:_reciverid", AuthRouter.GetMessage);
router.get("/fetchConv/:id", AuthRouter.GetConv);
module.exports = router;
