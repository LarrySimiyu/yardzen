import React, { useState, useEffect } from "react";
import BudgetInput from "./BudgetInput";
import _ from "lodash";

import db from "../firebase";
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore";

const ItemSelector = () => {
  const [budget, setBudget] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalLow, setTotalLow] = useState(0);
  const [totalHigh, setTotalHigh] = useState(0);

  const handleBudgetSubmission = (finalBudget) => {
    console.log(finalBudget);
    setBudget(finalBudget);
  };

  const grouped = _.groupBy(items, (item) => item.type);

  const handleSelectedItems = (item) => {
    let isInArr = false;
    let selectedIndex;
    setTotalLow(0);
    // if same type is in selected items, replace that item
    selectedItems?.map((selected, idx) => {
      if (selected.type && selected.type === item.type) {
        isInArr = true;
        selectedIndex = idx;
        setTotalLow((totalLow) => (totalLow += selected.lowPrice));
      }
    });

    if (isInArr) {
      // delete if found
      selectedItems.splice(selectedIndex, 1);
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const aggregateLowPrice = () => {
    let lowPrice = 0;
    selectedItems.forEach((item) => {
      return (lowPrice += item.lowPrice);
    });
    setTotalLow(lowPrice / 100);
  };

  const aggregateHighPrice = () => {
    let highPrice = 0;
    selectedItems.forEach((item) => {
      return (highPrice += item.highPrice);
    });
    setTotalHigh(highPrice / 100);
  };

  const displayBudgetMessage = () => {
    if (totalLow > budget || totalHigh > budget) {
      return <p>You are over budget</p>;
    } else if (totalHigh <= budget) {
      return <p>You are on budget</p>;
    }
    return <p>You are under budget</p>;
  };

  const handleChecklistUpload = async () => {
    try {
      await setDoc(
        doc(db, "larrySimiyuBudgetChecklist", "checklistTestId0003"),
        {
          items: selectedItems,
        }
      );
      console.log("success push");
    } catch (error) {
      console.log(error, "push didnt work");
      return error;
    }
  };

  const isEnabled = selectedItems.length > 0;

  useEffect(() => {
    // on snapshot updates itself everytime it detects a change in the database
    try {
      onSnapshot(collection(db, "items"), (snapshot) => {
        const returnData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(returnData);
      });
    } catch (error) {
      return error;
    }
  }, []);

  useEffect(() => {
    console.log(selectedItems);
    aggregateLowPrice();
    aggregateHighPrice();
  }, [selectedItems]);

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
          {Object.entries(grouped).map(([key, value]) => (
            <React.Fragment>
              <p className="itemSection">Type: {key}</p>
              {value.map((item, idx) => (
                <p
                  key={item.id}
                  className="tempBorder"
                  onClick={() => handleSelectedItems(item, idx)}
                >
                  Name: {item.name} LowPrice: {item.lowPrice / 100} : HighPrice:{" "}
                  {item.highPrice / 100} TotalLow: {totalLow} TotalHigh:{" "}
                  {totalHigh}
                </p>
              ))}
            </React.Fragment>
          ))}
          {displayBudgetMessage()}
          {selectedItems.map((item) => (
            <p>{item.name}</p>
          ))}
          <button disabled={!isEnabled} onClick={handleChecklistUpload}>
            Submit
          </button>
        </div>
      </div>
    );
  }
};

export default ItemSelector;
