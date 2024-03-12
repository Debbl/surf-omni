import { RouterProvider } from "react-router-dom";
import { Spin } from "antd";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { router } from "./router";

function App() {
  const { isLoading } = useLoadFormLocal();

  if (isLoading) return <Spin fullscreen />;

  return <RouterProvider router={router} />;
}

export default App;
