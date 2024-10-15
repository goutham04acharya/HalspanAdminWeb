import React, { useState } from 'react'

function RangeSlider() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);

  const handleMinSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  };
  return (
    <div className=" form-control mt-2 pt-2 w-full">
      <label className="label-text block text-sm font-medium ">
        <div className="flex flex-col space-y-2">
          <input
            type="range"
            min="0"
            max="3000"
            value={minPrice}
            onChange={handleMinSliderChange}
            step="100"
            className="w-full range range-xs range-info"
          />
        </div>
        <p className='font-normal text-[#2B333B] italic mt-5'>Select Value: {minPrice}</p>
      </label>
    </div>
  )
}

export default RangeSlider