import React from "react";

const Item = ({
  id,
  name,
  lowPrice,
  highPrice,
  className,
  onClick,
  itemImages,
  formatDollarValue,
}) => {
  return (
    <div className={className} key={id} onClick={onClick}>
      <div className="itemImageContainer">
        <img src={itemImages.get(name)} alt="item" className="itemImage" />
      </div>
      <div className="itemDetailsContainer">
        <div className="itemNameContainer">{name}</div>
        <div className="itemPriceContainer">
          ${formatDollarValue(lowPrice)} - ${formatDollarValue(highPrice)}
        </div>
      </div>
    </div>
  );
};

export default Item;
