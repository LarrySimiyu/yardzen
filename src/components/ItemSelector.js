import React, { useState, useEffect } from "react";
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore";
import _ from "lodash";

import BudgetInput from "./BudgetInput";
import Item from "./Item";
import db from "../firebase";

const ItemSelector = () => {
  const [budget, setBudget] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalLowPrice, setTotalLowPrice] = useState(0);
  const [totalHighPrice, setTotalHighPrice] = useState(0);

  const handleBudgetSubmission = (finalBudget) => {
    setBudget(finalBudget);
  };

  const handleSelectedItems = (item) => {
    let isInArr = false;
    let selectedIndex;
    setTotalLowPrice(0);
    // if the selected item type can be found in selectedItems arr, replace the old item with the newly selected item
    selectedItems?.map((selected, idx) => {
      if (selected.type && selected.type === item.type) {
        isInArr = true;
        selectedIndex = idx;
        setTotalLowPrice(
          (totalLowPrice) => (totalLowPrice += selected.lowPrice)
        );
      }
    });

    if (isInArr) {
      // delete duplicate item type from its current index
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
    setTotalLowPrice(lowPrice / 100);
  };

  const aggregateHighPrice = () => {
    let highPrice = 0;
    selectedItems.forEach((item) => {
      return (highPrice += item.highPrice);
    });
    setTotalHighPrice(highPrice / 100);
  };

  const displayBudgetMessage = () => {
    if (totalLowPrice > budget || totalHighPrice > budget) {
      return <p>You are over budget</p>;
    } else if (totalHighPrice <= budget) {
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

  const listSubmissionEnabled = selectedItems.length > 0;
  const groupByItemType = _.groupBy(items, (item) => item.type);

  useEffect(() => {
    // if contents of items changes onSnapshot will be triggered returning updated data
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
          {Object.entries(groupByItemType).map(([key, value]) => (
            <React.Fragment>
              <p className="itemSection">Type: {key}</p>
              {value.map((item, idx) => (
                <Item
                  key={item.id}
                  className="tempBorder"
                  onClick={() => handleSelectedItems(item, idx)}
                  name={item.name}
                  lowPrice={item.lowPrice / 100}
                  highPrice={item.highPrice / 100}
                  totalLowPrice={totalLowPrice}
                  totalHighPrice={totalHighPrice}
                />
              ))}
            </React.Fragment>
          ))}
          {displayBudgetMessage()}
          {selectedItems.map((item) => (
            <p>{item.name}</p>
          ))}
          <button
            disabled={!listSubmissionEnabled}
            onClick={handleChecklistUpload}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
};

export default ItemSelector;
