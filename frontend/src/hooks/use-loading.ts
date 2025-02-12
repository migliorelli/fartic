import { useState } from "react";

type CallbackFn = () => unknown;
type StartLoadingFn = (callbackFn: CallbackFn) => Promise<void>;

const useLoading = (): [boolean, StartLoadingFn] => {
  const [loading, setLoading] = useState(false);

  const startLoading = async (callbackFn: CallbackFn) => {
    setLoading(true);
    try {
      await callbackFn();
    } finally {
      setLoading(false);
    }
  };

  return [loading, startLoading];
};

export default useLoading;
