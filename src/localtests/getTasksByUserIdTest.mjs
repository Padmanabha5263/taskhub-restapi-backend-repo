import event from "../../events/getTasksByUserIdEvent.json" assert { type: "json" };
import { TasksLambdaHandler } from "../handlers/TaskHandler.mjs";

TasksLambdaHandler(event)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
