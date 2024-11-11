const tasksRoute = require("./task.route");
const userRoute = require("./user.route");
const authMiddeware = require("../../middlewares/auth.middeware");

module.exports = (app) => {
  app.use("/tasks", authMiddeware.requireAuth, tasksRoute);

  app.use("/users", userRoute);
};
