import { useEffect, useState } from "react";
import { loadFromLocal } from "~/lib/store";

export function useLoadFormLocal() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await loadFromLocal();
      setIsLoading(false);
    })();
  }, []);

  return {
    isLoading,
  };
}
