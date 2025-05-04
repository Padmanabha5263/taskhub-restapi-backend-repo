import { TasksLambdaHandler } from "../handlers/TaskHandler.mjs";
import event from "../../events/createTaskEvent.json" assert { type: "json" };
TasksLambdaHandler(event)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
