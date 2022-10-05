import axios from "axios";
import React, { useCallback, useState } from "react";
import debounce from "../components/utils/debounce";
function Post() {
  const [success, setSuccess] = useState();
  const [data, setData] = useState("");
  const [dataArea, setDataArea] = useState("");
  const postData = useCallback(
    debounce((e) => {
      e.preventDefault();
      if (e.target.value === "") {
        setSuccess(true);
        setData("");
        return;
      }
      axios
        .post("/api/change/", {
          data: e.target.value,
          type: "1",
        })
        .then(function (response) {
          // console.log(response.data);
          setSuccess(true);
          setData(response.data);
        })
        .catch(function (error) {
          console.log(error);
          setSuccess(false);
        });
    }, 500),
    []
  );
  console.log(data);

  return (
    <div className="flex justify-center items-center h-screen space-x-4">
      <textarea
        id="area"
        className="border-2 border-black w-60 h-60"
        value={dataArea}
        onChange={(e) => {
          postData(e);
          setDataArea(e.target.value);
        }}
      ></textarea>
      <textarea
        className="border-2 border-black w-60 h-60"
        value={data}
        readOnly
      ></textarea>
    </div>
  );
}

export default Post;
