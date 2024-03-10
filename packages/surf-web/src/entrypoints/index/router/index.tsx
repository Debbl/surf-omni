import { createHashRouter } from "react-router-dom";
import Index from "../pages/Index";
import Profile from "../pages/profile/Index";
import ProfileName from "../pages/profile/ProfileName";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: ":profileName",
            element: <ProfileName />,
          },
        ],
      },
    ],
  },
]);

export { router };
