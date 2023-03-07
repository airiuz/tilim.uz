import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { dislike, dislike_active, like, like_bold } from "../utils/icons";

function TextRate({ value }) {
  const [rate, setRate] = useState({
    like: false,
    dislike: false,
    id: null,
  });
  const handleLike = useCallback(() => {
    setRate((prev) => ({
      ...prev,
      like: !rate.like,
      dislike: false,
    }));
  }, [rate]);
  const handleDisLike = useCallback(() => {
    setRate((prev) => ({
      ...prev,
      dislike: !rate.dislike,
      like: false,
    }));
  }, [rate]);

  useEffect(() => {
    if ((!rate.id && rate.dislike) || (!rate.id && rate.like)) {
      const data = { text: value, like: rate.like ? true : false };
      axios
        .post("/api/statistic/", data)
        .then((res) => setRate((prev) => ({ ...prev, id: res.data.id })))
        .catch((error) => console.log(error));
    }
    if ((rate.id && rate.dislike) || (rate.id && rate.like)) {
      const data = { text: value, like: rate.like ? true : false };
      axios
        .put(`/api/statistic/${rate.id}`, data)
        .then((res) => setRate((prev) => ({ ...prev, id: res.data.id })))
        .catch((error) => console.log(error));
    }
  }, [rate.like, rate.dislike]);
  if (rate.id && !rate.dislike && !rate.like) {
    axios
      .delete(`/api/statistic/${rate.id}`)
      .then((res) => {
        setRate((prev) => ({ ...prev, id: null }));
      })
      .catch((error) => console.log(error));
  }
  return (
    <>
      <button
        className={`${
          rate.like
            ? "fill-primary dark:fill-darkPrimary"
            : "stroke-[#0D2148] dark:stroke-darkTernary"
        }`}
        onClick={handleLike}
      >
        {rate.like ? like_bold : like}
      </button>
      <button
        className={`${
          rate.dislike
            ? "fill-primary dark:fill-darkPrimary"
            : "stroke-[#0D2148] dark:stroke-darkTernary"
        }`}
        onClick={handleDisLike}
      >
        {rate.dislike ? dislike_active : dislike}
      </button>
    </>
  );
}

export default TextRate;
