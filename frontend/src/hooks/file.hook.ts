import { useFileStore } from "@/src/store/file.store";
import { useCallback, useEffect, useState } from "react";
import useAxios from "@/src/hooks/axios.hook";

export const useFile = () => {
  const { file, setName, reject } = useFileStore();
  const { fetchData, error, loading } = useAxios();
  const postData = useCallback(
    async (transcript: string) => {
      const formData = new FormData();
      formData.append("t", transcript);
      formData.append("in_file", file!);
      const result = await fetchData("changefile/", "POST", formData);
      setName(result.out_file);
    },
    [file, setName]
  );
  return { loading, postData, error };
};
