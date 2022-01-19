import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "../styles/budgetInput.css";

const BudgetInput = ({ submitBudget, formatDollarValue }) => {
  const [budget, setBudget] = useState(0);

  // allows user to only enter a numeric value in the input field
  const handleBudgetInput = (event) => {
    const budgetInput = event.target.value.replace(/\D/g, "");
    setBudget(budgetInput);
  };

  const handleBudgetFormSubmission = (event) => {
    if (budget !== 0) {
      event.preventDefault();
      submitBudget(budget);
    }
  };

  const enableSubmitButton = budget > 0;

  return (
    <div className="budgetInputCard">
      <div className="budgetInputContent">
        <div className="budgetCardHeader">
          <div className="budgetInputDisplay">${formatDollarValue(budget)}</div>
        </div>
        <div className="budgetForm">
          <div className="budgetMessage">
            Let's get you started. Enter your <span> budget</span>.
          </div>
          <form onSubmit={handleBudgetFormSubmission}>
            <div className="budgetInputContainer">
              <TextField
                variant="outlined"
                id="budget"
                type="text"
                value={budget}
                data-testid="budget-input"
                placeholder="0"
                onChange={handleBudgetInput}
                size="small"
              />

              <Button
                type="submit"
                variant="contained"
                className="budgetSubmitButton"
                disabled={!enableSubmitButton}
                sx={{
                  backgroundColor: "#A663CC",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetInput;
