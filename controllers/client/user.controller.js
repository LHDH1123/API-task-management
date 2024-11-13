const md5 = require("md5");
const User = require("../../model/user.model");
const ForgotPassword = require("../../model/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

//Cho chạy qua validates
//[POST] /users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);

  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateHelper.generateRandomString(30),
    });
    user.save();

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công",
      token: token,
    });
  }
};
//[POST] /users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Tài khoản không tồn tại",
    });
  } else {
    if (md5(password) == user.password) {
      res.cookie("token", user.token);

      res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: user.token,
      });
    } else {
      res.json({
        code: 400,
        message: "Nhập mật khẩu không đúng",
      });
    }
  }
};
//[POST] /users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại",
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  forgotPassword.save();

  //Nếu tồn tại email thì gởi mã OTP về email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `Mã OTP để lấy lại mật khẩu: <b>${otp}</b>`;
  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
  });
};
//[POST] /users/password/otp
module.exports.otp = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ",
    });
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("token", user.token);

  res.json({
    code: 200,
    message: "Xác thực thành công",
    token: user.token,
  });
};
//[POST] /users/password/reset
module.exports.reset = async (req, res) => {
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (confirmPassword !== newPassword) {
    res.json({
      code: "400",
      message: "Xác nhận lại mật khẩu không đúng",
    });
    return;
  }

  await User.updateOne(
    {
      token: req.cookies.token,
    },
    {
      password: md5(passwordNew),
    }
  );

  res.json({
    code: "200",
    message: "Thanh đổi mật khẩu thành công",
  });
};
//[POST] /users/detail/:id
module.exports.detail = async (req, res) => {
  res.json({
    code: "200",
    info: req.user,
  });
};
//[GET] /users/list
module.exports.listUser = async (req, res) => {
  const users = await User.find({
    deleted: false,
  }).select("fullName email");

  res.json({
    code: "200",
    info: users,
  });
};
