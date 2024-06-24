import { DislikeIcon, LikeIcon } from "@/src/common/Utils/icons";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import useAxios from "@/src/hooks/axios.hook";
import { useTextEditorStore } from "@/src/store/translate.store";

export const Rate = () => {
  const { editorState } = useTextEditorStore();

  const [id, setId] = useState<number | null>(null);

  const [like, setLike] = useState(false);

  const [dislike, setDislike] = useState(false);

  const { fetchData } = useAxios();

  useEffect(() => {
    setLike(false);
    setDislike(false);
  }, [editorState.getCurrentContent().getPlainText()]);

  const handleLike = async (likeArg: boolean, dislikeArg: boolean) => {
    const text = editorState.getCurrentContent().getPlainText();
    if (text.trim()) {
      setLike(likeArg);
      setDislike(dislikeArg);
      if (like || dislike) {
        if ((like && likeArg) || (dislikeArg && dislike)) {
          await fetchData(`statistic/${id}`, "DELETE");
          setDislike(false);
          setLike(false);
          return setId(null);
        }
        await fetchData(`statistic/${id}`, "PUT", { text, like: likeArg });
        setLike(likeArg);
        setDislike(dislikeArg);
        return;
      }
      const res = await fetchData("statistic/", "POST", {
        like: likeArg,
        text,
      });
      if (res && res.id) setId(res.id);
    }
  };

  return (
    <div>
      <span
        className={`${dislike && styles.active}`}
        onClick={() => handleLike(false, true)}
      >
        {DislikeIcon}
      </span>
      <span
        className={`${like && styles.active}`}
        onClick={() => handleLike(true, false)}
      >
        {LikeIcon}
      </span>
    </div>
  );
};
