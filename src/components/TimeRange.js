import React, { useState } from "react";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import "../input.css";
export default function TimeRange(props) {
  const [value, setValue] = useState(["10:00", "11:00"]);

  const onChange = (val) => {
    console.log(val, "123", setValue(val));
    props.onChange(val);
  };
  return (
    <div>
      <TimeRangePicker
        onChange={onChange}
        value={value}
        maxDetail="hour"
        clockIcon={null}
        className="inputWidth"
      />
    </div>
  );
}
