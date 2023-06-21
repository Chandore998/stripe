const express = require("express");
const router = express.Router();

const stripeController = require("../controllers/stripeController.js");
const { upload } = require("../config/helper.js");
router.get('/createDriverAccount', stripeController.createDriverAccount);
router.post('/createPaymentIntent', stripeController.createPaymentIntents);
router.post('/acceptPayment', stripeController.acceptPayment);
router.get('/createDriverAccount', stripeController.createDriverAccount);
router.post('/createAccount', upload.fields([{ name: 'photo', maxCount: 2 }]), stripeController.createAccount);
router.post("/webhook/updateAccount", stripeController.updateAccount)
router.post("/test", stripeController.test1)
router.get("/getAllcard", stripeController.getAllcard)


module.exports = router;
