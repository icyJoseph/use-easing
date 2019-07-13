import React from "react";
import useEasing from "use-easing";
import { easeInQuad } from "use-easing/lib/easings";

import Chart from "./Chart";

enum actions {
  INC = "+",
  DEC = "-"
}

interface Inc {
  type: typeof actions.INC;
}

interface Dec {
  type: typeof actions.DEC;
}
type actionTypes = Inc | Dec;

const inc: Inc = { type: actions.INC };
const dec: Dec = { type: actions.DEC };

const reducer = (state: number, action: actionTypes): number => {
  switch (action.type) {
    case actions.INC:
      return state + 1;
    case actions.DEC:
      return state - 1;
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, 10);

  return (
    <div className="App">
      <h1 className="title">useEasing</h1>
      <section>
        <span>Goal: {state}</span>
      </section>
      <section className="btn-ctrl">
        <button onClick={() => dispatch(inc)}>Inc</button>
        <button onClick={() => dispatch(dec)}>Dec</button>
      </section>
      <Chart end={state} />
    </div>
  );
};

export default App;
