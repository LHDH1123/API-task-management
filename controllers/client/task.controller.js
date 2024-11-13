const Task = require("../../model/task.model");

module.exports.index = async (req, res) => {
  const find = {
    $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }

  // Phân trang
  let limitItems = 5;
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }
  const skip = (page - 1) * limitItems;
  // Hết Phân trang

  // Tìm kiếm
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // Hết Tìm kiếm
  const tasks = await Task.find(find).limit(limitItems).skip(skip).sort(sort);

  res.json(tasks);
};

module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });
  res.json(task);
};

module.exports.changeMultiPatch = async (req, res) => {
  const status = req.body.status;
  const ids = req.body.ids;

  await Task.updateMany(
    {
      _id: { $in: ids },
    },
    {
      status: status,
    }
  );
  res.json({
    code: "success",
    message: "Thành công!",
  });
};

module.exports.createPost = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const task = new Task(req.body);
    await task.save();

    res.json({
      code: 200,
      message: "Tạo công việc thành công!",
      data: task,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  await Task.updateOne(
    {
      _id: id,
    },
    data
  );
  res.json({
    code: "success",
    message: "Cập nhật công việc thành công!",
  });
};

module.exports.deleteMultiPatch = async (req, res) => {
  const ids = req.body.ids;
  await Task.updateMany(
    {
      _id: { $in: ids },
    },
    {
      deleted: true,
    }
  );
  res.json({
    code: "success",
    message: "Xóa thành công!",
  });
};
