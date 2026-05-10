const datacontroller = require("../controllers/passdatacontroller");
const express = require("express");
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.post("/masterkey", datacontroller.Masterkey);
router.post("/adddata", datacontroller.addData);
router.post("/getdata", datacontroller.getData);
router.patch("/updatedata", datacontroller.updateData);
router.delete("/deletedata", datacontroller.deleteData);

module.exports = router;
