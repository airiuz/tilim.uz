import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import Layout from "../components/Layout";
import { HashLoader } from "react-spinners";
const NUMB_OF_WORDS = 200;
const SECONDS = 60;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        return "bg-green-500";
      } else {
        return "bg-red-500";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "bg-yellow-500";
    } else {
      return "";
    }
  }

  return (
    <Layout>
      <div className="bg-tezyoz h-screen flex flex-col justify-center items-center space-y-4">
        <div className="text-6xl text-[#273A5D]">
          Tez yozishni sinash bo&apos;limi hozirda jarayonda
        </div>
        <div className="text-3xl animate-pulse text-primary">
          Tez kunda.....
        </div>
      </div>
      {/* <div className="fixed inset-0 bg-white z-50 grid place-content-center">
        <HashLoader color="#3474DF" />
      </div> */}
    </Layout>
    // <div className="max-w-7xl mx-auto space-y-2">
    //   <div className="section">
    //     <div className="text-4xl flex justify-center">
    //       <h2>{countDown}</h2>
    //     </div>
    //   </div>
    //   {status === "started" && (
    //     <div className="section mt-4">
    //       <div className="card">
    //         <div className="card-content">
    //           <div className="content">
    //             {words.map((word, i) => (
    //               <span key={i}>
    //                 <span>
    //                   {word.split("").map((char, idx) => (
    //                     <span className={getCharClass(i, idx, char)} key={idx}>
    //                       {char}
    //                     </span>
    //                   ))}
    //                 </span>
    //                 <span> </span>
    //               </span>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   <div className="control is-expanded section mt-2">
    //     <input
    //       ref={textInput}
    //       disabled={status !== "started"}
    //       type="text"
    //       className="input bg-red-500 w-full outline-none h-12 px-2"
    //       onKeyDown={handleKeyDown}
    //       value={currInput}
    //       onChange={(e) => setCurrInput(e.target.value)}
    //     />
    //   </div>
    //   <div className="section">
    //     <button className="w-full bg-green-400" onClick={start}>
    //       Start
    //     </button>
    //   </div>

    //   {status === "finished" && (
    //     <div className="flex justify-between bg-blue-400">
    //       <div className="flex justify-between w-full">
    //         <div className="flex flex-col items-center">
    //           <p className="is-size-5">Words per minute:</p>
    //           <p className="has-text-primary is-size-1">{correct}</p>
    //         </div>
    //         <div className="flex flex-col items-center">
    //           <p className="is-size-5">Accuracy:</p>
    //           {correct !== 0 ? (
    //             <p className="has-text-info is-size-1">
    //               {Math.round((correct / (correct + incorrect)) * 100)}%
    //             </p>
    //           ) : (
    //             <p className="has-text-info is-size-1">0%</p>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}

export default App;
