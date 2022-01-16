import { render, screen } from "@testing-library/react";
import BudgetInput from "./components/BudgetInput";
import Item from "./components/Item";
import ItemSelector from "./components/ItemSelector";

test("render item component", () => {
  render(<Item />);
  expect(screen.getByText(/NAME/)).toBeInTheDocument();
});

test("render budget input component", () => {
  render(<BudgetInput />);
  expect(screen.getByText(/Enter Your Budget/)).toBeInTheDocument();
});

test("render item selector component", () => {
  render(<ItemSelector />);
  expect(screen.getByText(/Enter Your Budget/)).toBeInTheDocument();
});

test("render budget input", () => {
  render(<BudgetInput />);
  const inputElement = screen.getByTestId("budget-input");
  expect(inputElement).toBeInTheDocument();
  expect(inputElement).toHaveAttribute("placeholder", "Enter Budget");
});
