import React, { useState, useEffect } from "react";
import BudgetInput from "./BudgetInput";
import _ from "lodash";

import db from "../firebase";
import { onSnapshot, collection } from "firebase/firestore";

const ItemSelector = () => {
  const [budget, setBudget] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleBudgetSubmission = (finalBudget) => {
    console.log(finalBudget);
    setBudget(finalBudget);
    console.log(budget, "item selector");
  };

  console.log(items);
  const grouped = _.groupBy(items, (item) => item.type);
  console.log(grouped, "grouped items object");

  for (const [key, value] of Object.entries(grouped)) {
    console.log(
      key,
      "object keys",
      value.map((item) => item),
      "object values with type"
    );
  }

  useEffect(
    () =>
      // on snapshot updates itself everytime it detects a change in the database
      // returns on useEffect, successfully terminates listener
      onSnapshot(collection(db, "items"), (snapshot) => {
        const returnData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(returnData);
      }),
    []
  );

  if (budget === 0) {
    return (
      <BudgetInput
        submitBudget={(finalBudget) => handleBudgetSubmission(finalBudget)}
      />
    );
  } else {
    return (
      <div>
        Current Budget: {budget}
        <div>
          {/* {items.map((item) => (
            <p key={item.id}>{item.name}</p>
          ))} */}

          {Object.entries(grouped).map(([key, value]) => (
            <React.Fragment>
              <p>Type: {key}</p>
              {value.map((item) => (
                <p key={item.id} className="tempBorder">
                  Name: {item.name} LowPrice: {item.lowPrice} : HighPrice:{" "}
                  {item.highPrice}
                </p>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
};

export default ItemSelector;
