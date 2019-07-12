import React from "react";
import useEasing from "use-easing";
import { easeInQuad } from "use-easing/lib/easings";

import Chart from "./Chart";
import infinite from "./infinite";

const alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const infiniteAlphabet = infinite(alphabet.split(""));

const App: React.FC = () => {
  const { count, setTrigger } = useEasing<number>({
    start: 0,
    end: alphabet.length - 1,
    duration: 5,
    easingFn: easeInQuad,
    autoStart: false,
    formatFn: x => Math.floor(x)
  });

  const [letter, setLetter] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setTrigger(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    setLetter(infiniteAlphabet.next().value);
  }, [count]);

  return (
    <div>
      <Chart />
      <div style={{ width: 500 }}>{count}</div>
      <div style={{ width: 500 }}>{letter}</div>
    </div>
  );
};

export default App;
