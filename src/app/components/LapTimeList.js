import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
function LapTimeList({ lapseTime }) {
  return (
    <div className="timeLapse">
      <div className="timeLapse__head">
        <div>LAPS</div>
        <div>HH</div>
        <div>MM</div>
        <div>SS</div>
        <div>MS</div>
      </div>
      <Scrollbars autoHeight>
        {lapseTime.map((item, index) => {
          return (
            <div key={index} className="timeLapse__time">
              <div>{index + 1}</div>
              <div>{item.hours}</div>
              <div>{item.minutes}</div>
              <div>{item.seconds}</div>
              <div>{item.centiseconds}</div>
            </div>
          );
        })}
      </Scrollbars>
    </div>
  );
}
export default LapTimeList;
