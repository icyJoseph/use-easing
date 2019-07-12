import React from "react";
import { LineChart, Line, Legend, XAxis, YAxis } from "recharts";
import useEasing from "use-easing";
import { easeOutElastic } from "use-easing/lib/easings";

const colors = ["#fff489", "#fa57c1", "#b166cc", "#7572ff", "#69a6f9", "coral"];

interface IChart {
  end: number;
}

export function Chart({ end }: IChart) {
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
    <div>
      <section>
        <button onClick={() => setTrigger(true)}>Start</button>
        <button onClick={() => setTrigger(false)}>Stop</button>
      </section>
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
          name="easeOutElastic"
          type="monotone"
          dataKey="value"
          stroke={colors[0]}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}

export default Chart;
