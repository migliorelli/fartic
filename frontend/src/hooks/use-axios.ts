import axiosClient from "@/services/axios-service";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import useLoading from "./use-loading";

const useAxios = <Data = unknown>(path: string, canFetch: boolean = true) => {
  const [data, setData] = useState<null | Data>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, startLoading] = useLoading();
  const [fetched, setFetched] = useState(false);

  const fetchData = useCallback(() => {
    if (!canFetch) return;

    setError(null)
    startLoading(async () => {
      try {
        const response = await axiosClient.get(path);
        setData(response.data as Data);
      } catch (e) {
        const err = e as AxiosError;
        setError(err.message);
      }
    });
  }, [path, startLoading, canFetch]);

  useEffect(() => {
    if (!fetched && canFetch) {
      setFetched(true);
      fetchData();
    }
  }, [fetchData, data, loading, fetched, canFetch]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
};

export default useAxios;
