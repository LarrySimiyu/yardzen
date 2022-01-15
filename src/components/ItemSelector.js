import React, { useState, useEffect } from "react";
import BudgetInput from "./BudgetInput";

const ItemSelector = () => {
  const [budget, setBudget] = useState(0);
  const [items, setItems] = useState([]);

  const handleBudgetSubmission = (finalBudget) => {
    console.log(finalBudget);
    setBudget(finalBudget);
    console.log(budget, "item selector");
  };

  const fetchItems = () => {};

  useEffect(() => {});

  if (budget === 0) {
    return (
      <BudgetInput
        submitBudget={(finalBudget) => handleBudgetSubmission(finalBudget)}
      />
    );
  } else {
    return <div>Current Budget: {budget}</div>;
  }
};

export default ItemSelector;
