describe("Basic", () => {
  it("is basic", () => {
    expect(2).toEqual(2);
  });
  it("is basic and fails", () => {
    expect(true).toBe(false);
  });
});

test("I also run", () => {
  expect("tomato").toBe("tomato");
});
