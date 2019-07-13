# use-easing

> Single dependency on React

`use-easing` helps you ease a value using a React Hook.

This package also provides a few easings, you can specify any easing you want.

The package is written using TypeScript.

> Inspired by [React CountUp](https://github.com/glennreyes/react-countup)

## Install

Available in NPM, as [use-easing](https://www.npmjs.com/package/use-easing)!

```
npm install use-easing
```

or

```
yarn install use-easing
```

## Demo

1. Clone repo `git clone git@github.com:icyJoseph/use-easing.git`
2. Install dependencies `yarn` or `npm i`
3. Run `yarn start:demo` or `npm run start:demo`
4. Go to `localhost:3001`

## Structure

The hook encapsulates a single `effect`, which kicks off a `process` that invokes `requestAnimationFrame`,
until the counter has arrived at its goal.

The `effect` depends on the `end` goal, the `duration` and the state of an internal `trigger`.

The hook returns, the `value` and a callback to alter the `trigger`.

## Basic Props

### `end`

The value will move toward this `end` goal, following a given easing curve and over a given period of time.

### `duration`

Measured in seconds.

```jsx
function App() {
  const { value } = useEasing({ end: 10, duration: 1 });
  return value;
}
```

This config starts on mount and goes up to 10, over 1 second. By default it uses, the `easeInQuad`.

```ts
export const easeInQuad: easing = (
  t: number,
  b: number,
  c: number,
  d: number
) => c * (t /= d) * t + b;
```

If you are using TypeScript, bare in mind that easings are typed as shown.

```tsx
function App() {
  const { value } = useEasing<number>({ end: 10, duration: 1 });
  return value;
}
```

You can also specify the type of value by passing a type parameter to `useEasing`.

## Optional Props

### `start`

By default the value starts at `0`, but this can be specified with the `start` prop.

### `autoStart`

The `effect` will kick off the `process` as soon as possible, to prevent this, declare `autoStart` `false`.

### `easingFn`

The easing function. This function is invoked on every `requestAnimationFrame`, and it calculates the current value value.

More on easing functions [here](http://robertpenner.com/easing/).

### `formatFn`

Applied to the outcome of the easing function. For example:

```js
const floor = x => Math.floor(x);
const fixed = x => x.toFixed(2);
```

You could even create a map where each number translates to some other symbol!

### `onCleanUp`

Called when the `effect` is cleaned up.

### `onPauseResume`

Called when the `process` is paused.

### `onStart`

Called when the `process` starts.

### `onEnd`

Called when the `process` ends.
