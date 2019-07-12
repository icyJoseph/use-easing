# use-easing

> Single dependency on React

`use-easing` helps you ease a value using a React Hook.

This package also provides a few easings, you can specify any easing you want.

The package is written using TypeScript.

## Basic Props

```jsx
function App() {
  const { count } = useEasing({ end: 10, duration: 1 });
  return count;
}
```

This starts on mount and count up to 10, over 1 second. By default it uses, the `easeInQuad`

> duration is in seconds!

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
  const { count } = useEasing<number>({ end: 10, duration: 1 });
  return count;
}
```

You can also specify the type of count by passing a type parameter to `useEasing`.

## Optional Props

### `start`

By default the count starts at `0`, but this can be specified with the `start` prop.

### `autoStart`

The counter runs as soon as it gets mounted, to prevent this, declare `autoStart` false.

### `easingFn`

The easing function. This function is invoked on every `requestAnimationFrame`, and it calculates the current count value.

More on easing functions [here](http://robertpenner.com/easing/).

### `formatFn`

Applied to the outcome of the easing function. For example:

```js
const floor = x => Math.floor(x);
const fixed = x => x.toFixed(2);
```

### `onCleanUp`

Called when the effect is cleaned up.

### `onPaused`

Called when the count up process is paused.

### `onStart`

Called when the count up process starts.

### `onEnd`

Called when the count up process ends.
