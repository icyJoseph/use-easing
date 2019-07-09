function* infinite<T>(arr: T[]) {
  const base = arr.length;
  let current = 0;
  while (true) {
    const index = current % base;
    yield arr[index];
    current++;
  }
}

export default infinite;
