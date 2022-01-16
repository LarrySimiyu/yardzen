import React from "react";

const Item = ({
  id,
  name,
  lowPrice,
  highPrice,
  totalLowPrice,
  totalHighPrice,
  className,
  onClick,
}) => {
  return (
    <div className={className} key={id} onClick={onClick}>
      NAME: {name}
      LOWPRICE: {lowPrice}
      HIGHPRICE: {highPrice}
      LOW: {totalLowPrice}
      HIGH: {totalHighPrice}
    </div>
  );
};

export default Item;
