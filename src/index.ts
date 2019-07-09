import { useState, useEffect, useRef } from "react";
import { easing } from "./easings";

type Noop = () => void;
type Trigger = (_: boolean) => void;
type Format<T> = (_: number) => T;

interface FormatFn<T> {
  format: (_: number) => T;
}

interface CountProps<T> {
  start?: number;
  end: number;
  duration: number;
  easingFn: easing;
  formatFn?: Format<T>;
  autoStart?: boolean;
}

interface UseCountUpResult<T> {
  count: T;
  setTrigger: Trigger;
}

const formatter = <T>(f: Format<T>): FormatFn<T> => ({
  format: f
});

const noop: Noop = () => {};
const identity = (val: any) => val;

export function useCountUp<T>({
  start = 0,
  end,
  duration,
  easingFn,
  formatFn = identity,
  autoStart = true
}: CountProps<T>): UseCountUpResult<T> {
  const [trigger, setTrigger] = useState(autoStart);
  const [data, setData] = useState<number>(start);
  const easingFnRef = useRef<easing>(easingFn);
  const dataRef = useRef<number>(data);
  dataRef.current = data;

  useEffect(() => {
    let raf: number;
    let callNewRaf: boolean = true;
    if (trigger) {
      console.group("CountUp Effect starts");
      // request animation frames receives time in milliseconds
      raf = window.requestAnimationFrame((startTime: number) => {
        const endTime = startTime + duration * 1000;
        // what to use as starting point?
        const _start = dataRef.current;
        // get the total change
        const change = end - _start;
        console.log("Animation Frames running with these settings:", {
          start: _start,
          currentRef: dataRef.current,
          end,
          change,
          startTime,
          endTime
        });
        console.groupEnd();
        setData(_start);

        const handler = (time: number) => {
          if (time > endTime) {
            setData(end);
            return noop;
          }
          setData(() =>
            easingFnRef.current(
              time - startTime,
              _start,
              change,
              duration * 1000
            )
          );
          if (callNewRaf) {
            raf = window.requestAnimationFrame(handler);
          }
          return noop;
        };

        raf = window.requestAnimationFrame(handler);
      });
    } else {
      console.group("CountUp effect");
      console.log("But it could not be started");
      console.log("trigger", trigger);
      console.groupEnd();
    }

    return () => {
      console.group("CountUp Clean Up");
      console.log("trigger: ", trigger);
      console.log("CountUp: ", dataRef.current);
      console.log("Animation Frame: ", raf);
      console.groupEnd();
      callNewRaf = false;
      window.cancelAnimationFrame(raf);
    };
  }, [trigger, end, duration]);

  const userFormat = formatter<T>(formatFn);

  return {
    count: userFormat.format(data),
    setTrigger
  } as UseCountUpResult<T>;
}

export default useCountUp;
