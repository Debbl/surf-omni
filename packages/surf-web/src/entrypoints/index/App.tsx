import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { loadFromLocal } from "@/lib/store";
import { router } from "./router";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await loadFromLocal();
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <Spin fullscreen />;

  return <RouterProvider router={router} />;
}

export default App;
