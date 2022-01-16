import React, { useState } from "react";

const BudgetInput = ({ submitBudget }) => {
  const [budget, setBudget] = useState(0);

  // allows user to only enter a numeric value in the input field
  const handleBudgetInput = (event) => {
    const budgetInput = event.target.value.replace(/\D/g, "");
    setBudget(budgetInput);
  };

  const handleBudgetFormSubmit = (event) => {
    if (budget !== 0) {
      event.preventDefault();
      submitBudget(budget);
    }
  };

  const enableSubmitButton = budget > 0;

  return (
    <div>
      <form onSubmit={handleBudgetFormSubmit}>
        <label for="budget">
          Enter Your Budget
          <input
            id="budget"
            type="text"
            value={budget}
            data-testid="budget-input"
            placeholder="Enter Budget"
            onChange={handleBudgetInput}
          />
          <button type="submit" disabled={!enableSubmitButton}>
            Submit
          </button>
        </label>
      </form>
      <section>This is your budget: {budget}</section>
    </div>
  );
};

export default BudgetInput;
