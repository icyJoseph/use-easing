import React from "react";
import {
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import useEasing from "../../src/index";
import { easeOutElastic } from "../../src/easings";

const colors = ["#fff489", "#fa57c1", "#b166cc", "#7572ff", "#69a6f9", "coral"];

interface ChartProps {
  end: number;
}

export function Chart({ end }: ChartProps) {
  const [data, setData] = React.useState<object[]>([]);
  const { value, setTrigger } = useEasing<number>({
    start: 0,
    end,
    duration: 5,
    easingFn: easeOutElastic,
    autoStart: false
  });

  React.useEffect(() => {
    setData((prev: object[]) => [...prev, { value, index: prev.length }]);
  }, [value]);

  return (
    <div style={{ width: "80%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart width={300} height={300} data={data}>
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
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <section className="btn-ctrl">
        <button onClick={() => setTrigger(true)}>Start</button>
        <button onClick={() => setTrigger(false)}>Stop</button>
      </section>
    </div>
  );
}

export default Chart;
