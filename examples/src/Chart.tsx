import React from "react";
import { LineChart, Line, Legend, XAxis, YAxis } from "recharts";
import useCountUp from "./countUp";
import {
  // easeInOutBack
  // linear
  // easeInQuad
  // easeInOutSine
  easeOutElastic
  // easeBackIn,
} from "./countUp/easings";

const colors = ["#fff489", "#fa57c1", "#b166cc", "#7572ff", "#69a6f9", "coral"];

export const Chart = ({ easing }) => {
  const [end, setEnd] = React.useState(5);
  const [data, setData] = React.useState<object[]>([]);
  const { count, setTrigger } = useCountUp({
    start: 0,
    end,
    duration: 5,
    easingFn: easeOutElastic,
    autoStart: false
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setTrigger(true), 1000);
    return () => clearTimeout(timer);
  }, [setTrigger]);

  React.useEffect(() => {
    const timer = setTimeout(() => setTrigger(false), 9000);
    return () => clearTimeout(timer);
  }, [setTrigger]);

  React.useEffect(() => {
    const timer = setTimeout(() => setEnd(10), 4000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTrigger(true);
      setEnd(5);
    }, 12000);
    return () => clearTimeout(timer);
  }, [setTrigger]);

  React.useEffect(() => {
    setData((prev: object[]) => [...prev, { count, index: prev.length }]);
  }, [count]);

  return (
    <LineChart width={500} height={500} data={data}>
      <XAxis
        hide
        type="number"
        dataKey="index"
        domain={["dataMin", "dataMax"]}
        tickCount={10}
      />
      <YAxis />
      <Legend verticalAlign="top" height={36} />
      <Line
        name="easeOutElastic"
        type="monotone"
        dataKey="count"
        stroke={colors[0]}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
};

export default Chart;
