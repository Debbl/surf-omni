import { RouterProvider } from "react-router-dom";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { router } from "./router";

function App() {
  const { isLoading } = useLoadFormLocal();

  if (isLoading) return <div>loading</div>;

  return <RouterProvider router={router} />;
}

export default App;
