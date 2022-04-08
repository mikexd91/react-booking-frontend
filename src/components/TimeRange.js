import React, { useState } from "react";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import "../input.css";
export default function TimeRange({ onChange }) {
  const [value, setValue] = useState(["10:00", "11:00"]);

  const onChangeHandler = (val) => {
    setValue(val);
    onChange(val);
  };
  return (
    <div>
      <TimeRangePicker
        onChange={onChangeHandler}
        value={value}
        maxDetail="hour"
        clockIcon={null}
        className="inputWidth"
      />
    </div>
  );
}
