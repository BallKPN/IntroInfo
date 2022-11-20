const { check } = require("express-validator");

const router = require("express").Router();
const user = require("../controller/user");

router.post(
  "/register",
  [
    check("username", "โปรดกรอกชื่อผู้ใช้").notEmpty(),
    check("password", "รหัสผ่านต้องไม่ต่ำกว่า 6 ตัวอักษร")
      .isLength({
        min: 6,
      })
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("รหัสผ่านไม่ตรงกัน");
        } else {
          return value;
        }
      })
  ],
  user.register
);

router.post(
  "/login",
  [
    check("username", "โปรดกรอกชื่อผู้ใช้").notEmpty(),
    check("password", "โปรดกรอกรหัสผ่าน").notEmpty(),
  ],
  user.login
);

module.exports = router;
