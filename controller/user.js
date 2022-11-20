const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const { User } = require("..");

const register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const isExist = await User.findOne({ username }).exec();
  if (isExist.length > 0) {
    return res.status(400).json({
      errors: [
        {
          msg: "มีชื่อผู้ใช้นี้แล้ว",
        },
      ],
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, "password": hashedPassword });
  newUser.save((err, data) => {
    if (err) console.error(err);
  });

  let token = await JWT.sign(
    {
      username,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: parseInt(process.env.EXP_TIME),
    }
  );
  res.json({ token });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ username }).exec();
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!user.length > 0 || !isMatch) {
      return res.status(400).json({
        errors: [
          {
            msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          },
        ],
      });
    }
  } catch (error) {
    return res.status(400).json({
      errors: [
        {
          msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        },
      ],
    });
  }

  //JWT
  let token = await JWT.sign(
    {
      username,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: parseInt(process.env.EXP_TIME),
    }
  );
  res.json({ token });
};

const pushLike = async (req, res) => {
  const { title, _id } = req.body;
  await User.updateOne({ _id }, { $push: { like: title } });
  res.json("Liked");
};

const unLike = async (req, res) => {
  const { title, _id } = req.body;
  await User.updateOne({ _id }, { $pull: { like: title } });
  res.json("Unliked");
};

const pushDislike = async (req, res) => {
  const { title, _id } = req.body;
  await User.updateOne({ _id }, { $push: { dislike: title } });
  res.json("Disliked");
};

const unDislike = async (req, res) => {
  const { title, _id } = req.body;
  await User.updateOne({ _id }, { $pull: { dislike: title } });
  res.json("Undisliked");
};

module.exports = {
  register,
  login,
  pushLike,
  pushDislike,
  unLike,
  unDislike,
};
