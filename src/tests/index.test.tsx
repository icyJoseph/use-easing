import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const Counter: React.FC = () => <div>counter</div>;

test("loads and displays greeting", async () => {
  const { getByText } = render(<Counter />);

  const node = getByText(/counter/i);
  expect(node).toBeDefined();
});
