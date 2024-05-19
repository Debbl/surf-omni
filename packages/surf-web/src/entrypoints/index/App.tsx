import { RouterProvider } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { router } from "./router";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";

function App() {
  const { isLoading } = useLoadFormLocal();

  if (isLoading)
    return <Spinner className="h-screen w-full" label="Loading..." />;

  return <RouterProvider router={router} />;
}

export default App;
