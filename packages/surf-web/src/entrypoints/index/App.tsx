import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Loading } from "~/components/Loading";

function App() {
  const { isLoading } = useLoadFormLocal();

  if (isLoading) return <Loading />;

  return <RouterProvider router={router} />;
}

export default App;
