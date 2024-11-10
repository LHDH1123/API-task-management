const tasksRoute = require("./task.route");
const userRoute = require("./user.route");

module.exports = (app) => {
  app.use("/tasks", tasksRoute);
  
  app.use("/users", userRoute);
}