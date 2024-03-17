import { createHashRouter } from "react-router-dom";
import Index from "../pages/Index";
import ProfileIndex from "../pages/profile/Index";
import ProfileName from "../pages/profile/Name";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "profile",
        element: <ProfileIndex />,
        children: [
          {
            path: ":name",
            element: <ProfileName />,
          },
        ],
      },
    ],
  },
]);

export { router };
