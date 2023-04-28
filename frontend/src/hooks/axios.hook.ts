import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

axios.defaults.baseURL = "/api/";

const useAxios = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (
    url: string,
    method: AxiosRequestConfig["method"],
    body: object | null = null,
    headers: AxiosRequestConfig["headers"] = {}
  ) => {
    try {
      setLoading(true);
      const config: AxiosRequestConfig = { method, url, headers };
      if (body) {
        config.data = body;
      }
      const res = await axios(config);
      return res.data;
    } catch (err) {
      console.log(err);
      setError(err as string);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, error, loading };
};

export default useAxios;
