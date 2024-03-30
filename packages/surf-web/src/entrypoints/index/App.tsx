import { RouterProvider } from "react-router-dom";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Loading } from "~/components/Loading";
import { router } from "./router";

function App() {
  const { isLoading } = useLoadFormLocal();

  if (isLoading) return <Loading />;

  return <RouterProvider router={router} />;
}

export default App;
