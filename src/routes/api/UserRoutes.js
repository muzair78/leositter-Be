const express = require("express");
const router = express.Router();
const UserRouter = require("../../controller/user/controller");
const Auth = require("../../middleware/Auth");

router.get("/sitters/:service", UserRouter.Allcaregivers);
router.get("/caregiver/petSitters/:service", UserRouter.Allcaregivers);
router.get("/caregiver/:service", UserRouter.Allcaregivers);
router.get("/petSitter/:_id", UserRouter.users_profile);
router.get(
  "/caretaker/caretakerdata/people/:service",
  UserRouter.Allcaregivers
);
router.get("/caretaker-profile/:_id", UserRouter.users_profile);
router.get("/petsitter-profile/:_id", UserRouter.CareGiverPage);
router.get("/getmessage/:senderid/:_reciverid", UserRouter.GetMessage);
router.get("/fetchConv/:id", UserRouter.GetConv);
router.post("/send-messages/:sender_ID/:reciever_ID", UserRouter.SendMessage);

module.exports = router;
