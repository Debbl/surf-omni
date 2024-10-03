import { createHashRouter } from "react-router-dom";
import { isDev } from "~/constants";
import Index from "../pages/Index";
import ProfileIndex from "../pages/profile/Index";
import ProfileName from "../pages/profile/Name";
import Test from "../pages/Test";
import type { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
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
];

if (isDev) {
  routes.push({
    path: "test",
    element: <Test />,
  });
}

export const router = createHashRouter(routes);
