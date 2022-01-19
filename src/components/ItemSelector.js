import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import "../styles/itemSelector.css";
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore";
import _ from "lodash";

import BudgetInput from "./BudgetInput";
import Item from "./Item";
import { sectionTitleFormat } from "../formattedStrings/sectionTitleFormat";
import { itemImages } from "../formattedStrings/itemImageFormat";
import db from "../firebase";

import { v4 as uuidv4 } from "uuid";

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

  const formatDollarValueToString = (number) => {
    const formattedNumber = number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber;
  };

  const aggregatePrice = () => {
    aggregateLowPrice();
    aggregateHighPrice();
  };

  const displayBudgetMessage = () => {
    if (totalLowPrice > budget || totalHighPrice > budget) {
      return <div className="budgetWarning">You are over budget</div>;
    } else if (totalHighPrice <= budget) {
      return <div className="budgetWarning">You are on budget</div>;
    }
    return <div className="budgetWarning">You are under budget</div>;
  };

  const handleChecklistUpload = async () => {
    try {
      // const id = uuidv4().toString();
      await setDoc(doc(db, "larrySimiyuBudgetChecklist", uuidv4()), {
        items: selectedItems,
      });
    } catch (error) {
      return error;
    }
  };

  const listSubmissionEnabled = selectedItems.length > 0;
  const groupByItemType = _.groupBy(items, (item) => item.type);

  useEffect(() => {
    // if contents of items changes onSnapshot will be triggered returning updated data
    try {
      onSnapshot(collection(db, "items"), (snapshot) => {
        // adds id key and value to the returned data
        const returnData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // unique data creates a new Set and turns it back to an array removing all current duplicate objects
        const uniqueData = Array.from(
          new Set(returnData.map((data) => data.name))
        ).map((name) => {
          return returnData.find((data) => data.name === name);
        });
        setItems(uniqueData);
      });
    } catch (error) {
      return error;
    }
  }, []);

  useEffect(() => {
    aggregatePrice();
  }, [selectedItems]);

  if (budget === 0) {
    return (
      <div className="budgetInputPage">
        <BudgetInput
          formatDollarValue={formatDollarValueToString}
          submitBudget={(finalBudget) => handleBudgetSubmission(finalBudget)}
        />
      </div>
    );
  } else {
    return (
      <div className="itemSelectorContainer">
        <div className="items">
          {Object.entries(groupByItemType).map(([key, value]) => (
            <React.Fragment>
              <div className="itemSectionContainer"></div>
              <p className="itemSectionHeader">{sectionTitleFormat.get(key)}</p>
              <div className="sectionSubContainer">
                <div className="itemCardContainer">
                  {value.map((item, idx) => (
                    <Item
                      key={item.id}
                      className="itemCard"
                      onClick={() => handleSelectedItems(item, idx)}
                      formatDollarValue={formatDollarValueToString}
                      name={item.name}
                      lowPrice={item.lowPrice / 100}
                      highPrice={item.highPrice / 100}
                      totalLowPrice={totalLowPrice}
                      totalHighPrice={totalHighPrice}
                      itemImages={itemImages}
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="cartContainer">
          <div className="cartItems">
            <div className="budgetDisplayLabel">Budget</div>
            <div className="budgetDisplay">
              ${formatDollarValueToString(budget)}{" "}
            </div>
            <div> {displayBudgetMessage()}</div>
            <div className="totalContainer">
              ${formatDollarValueToString(totalLowPrice)} - $
              {formatDollarValueToString(totalHighPrice)}
            </div>

            <div className="selectedItemsLabel">
              Items ({selectedItems.length})
            </div>

            <div className="selectedItems">
              {selectedItems.map((item) => (
                <div className="cartItem">{item.name}</div>
              ))}
            </div>

            <Button
              disabled={!listSubmissionEnabled}
              onClick={handleChecklistUpload}
              variant="contained"
              className="submitCartButton"
              sx={{
                backgroundColor: "white",
                color: "#a663cc",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default ItemSelector;
