import { createHashRouter } from "react-router-dom";
import Index from "../pages/Index";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
  },
]);

export { router };
