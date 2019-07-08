import React from "react";
// import Chart from "./Chart";

import "./App.css";

import useCountUp from "../../src";
import { easeInQuad } from "../../src/easings";

// TODO: Review. This is very hacky!
// And would have to be done by the end user
function formatFn<A, B>(data: A): B {
  const formatted = ((data as unknown) as number).toFixed(2);
  return (formatted as unknown) as B;
}

const App: React.FC = () => {
  const { count, setTrigger } = useCountUp<string>({
    start: 0,
    end: 10,
    duration: 5,
    easingFn: easeInQuad,
    autoStart: false,
    formatFn
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setTrigger(true), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="App">
      {/* <Chart /> */}
      {count}
    </div>
  );
};

export default App;
