import { employeeHandler } from "../handlers/EmployeeResource.mjs";
import event from "../../events/event-post-item.json" assert { type: "json" };
employeeHandler(event)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => [console.log(err)]);
