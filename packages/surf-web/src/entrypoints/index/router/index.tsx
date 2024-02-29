import { Navigate, createHashRouter } from "react-router-dom";
import Index from "../pages/Index";
import Profile from "../pages/profile/Index";
import Proxy from "../pages/profile/new/Proxy";
import AutoSwitch from "../pages/profile/new/AutoSwitch";
import New from "../pages/profile/new/Index";
import Name from "../pages/profile/ProfileName";

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
            path: "new",
            element: <New />,
            children: [
              {
                index: true,
                element: <Navigate to="proxy" />,
              },
              {
                path: "proxy",
                element: <Proxy />,
              },
              {
                path: "auto-switch",
                element: <AutoSwitch />,
              },
            ],
          },
          {
            path: "name/:profileName",
            element: <Name />,
          },
        ],
      },
    ],
  },
]);

export { router };
