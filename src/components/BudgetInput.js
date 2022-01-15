import React, { useState } from "react";

const BudgetInput = ({ submitBudget }) => {
  const [budget, setBudget] = useState(0);

  const handleBudgetInput = (event) => {
    setBudget(event.target.value);
    console.log(budget, "budget input");
  };

  const handleBudgetFormSubmit = (event) => {
    if (budget !== 0) {
      event.preventDefault();
      console.log(budget, "current budget");
      submitBudget(budget);
    }
  };

  return (
    <div>
      <form onSubmit={handleBudgetFormSubmit}>
        <label>
          Enter Your Budget
          <input
            type="text"
            value={budget}
            placeholder="Enter Budget"
            onChange={handleBudgetInput}
          />
          <button type="submit">Submit</button>
        </label>
      </form>
      <section>This is your budget: {budget}</section>
    </div>
  );
};

export default BudgetInput;
