const router = require("express").Router();

const getTemperatureInLocation = require("../controllers/controllers");

router.get("/api/hello", getTemperatureInLocation);

module.exports = router;
