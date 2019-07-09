import React from "react";
// import Chart from "./Chart";

import "./App.css";

import infinite from "./infinite";
import useCountUp from "../../src";
import { easeInQuad } from "../../src/easings";

const alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const infiniteAlphabet = infinite(alphabet.split(""));

const App: React.FC = () => {
  const { count, setTrigger } = useCountUp<number>({
    start: 0,
    end: alphabet.length - 1,
    duration: 5,
    easingFn: easeInQuad,
    autoStart: false,
    formatFn: x => Math.floor(x)
  });

  const [index, setIndex] = React.useState("A");

  React.useEffect(() => {
    const timer = setTimeout(() => setTrigger(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    setIndex(infiniteAlphabet.next().value);
  }, [count]);

  return (
    <div className="App">
      {/* <Chart /> */}
      {count}
      {index}
    </div>
  );
};

export default App;
