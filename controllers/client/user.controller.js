const md5 = require("md5");
const User = require("../../model/user.model");
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
    const user = new User(req.body);
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
      });
    } else {
      res.json({
        code: 400,
        message: "Nhập mật khẩu không đúng",
      });
    }
  }
};
