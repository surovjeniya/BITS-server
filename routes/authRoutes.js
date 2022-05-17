const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");

const authLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Превышен лимит.Подождите 1 минуту.",
});

router.post(
  "/step1",
  authLimit,
  check("phone", "Некоректный номер телефона").custom((phone) => {
    const regExp = /^\s*\+?375((33\d{7})|(29\d{7})|(44\d{7}|)|(25\d{7}))\s*$/;
    if (!regExp.test(phone)) {
      return Promise.reject("Некорректный номер телефона");
    } else {
      return Promise.resolve(phone);
    }
  }),
  authController.registrationStepOne
);
router.post(
  "/step2",
  check("code", "Невалидный код").isLength({ min: 6, max: 6 }).isNumeric(),
  authController.registrationStepTwo
);

router.post("/logout", authController.logOut);
router.get("/refresh", authController.refresh);

module.exports = router;
