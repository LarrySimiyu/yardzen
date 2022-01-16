import React, { useState } from "react";

const BudgetInput = ({ submitBudget }) => {
  const [budget, setBudget] = useState(0);

  const handleBudgetInput = (event) => {
    const budgetInput = event.target.value.replace(/\D/g, "");
    setBudget(budgetInput);
  };

  const handleBudgetFormSubmit = (event) => {
    if (budget !== 0) {
      event.preventDefault();
      console.log(budget, "current budget");
      submitBudget(budget);
    }
  };

  const isEnabled = budget.length > 0;

  return (
    <div>
      <form onSubmit={handleBudgetFormSubmit}>
        <label for="budget">
          Enter Your Budget
          <input
            id="budget"
            type="text"
            value={budget}
            placeholder="Enter Budget"
            onChange={handleBudgetInput}
          />
          <button type="submit" disabled={!isEnabled}>
            Submit
          </button>
        </label>
      </form>
      <section>This is your budget: {budget}</section>
    </div>
  );
};

export default BudgetInput;
