import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

const Stars = ({
  className,
  count,
  percentile,
  fullIcon,
  emptyIcon = null,
  halfIcon = null,
  zeroIcon = null,
}) => {
  let starsToDraw
  if (halfIcon) {
    // round to nearest 0.5
    starsToDraw = count
      ? Math.round(count * 2) / 2
      : Math.round(percentile * 10) / 2;
  } else {
    starsToDraw = count
      ? Math.round(count)
      : Math.round(percentile * 5);
  }
  return (
    <div className={classnames(className, 'stars')}>
      {starsToDraw > 0 ? [1, 2, 3, 4, 5].map((starPos) => {
        if (starsToDraw >= starPos) {
          return <FontAwesomeIcon key={starPos} icon={fullIcon} />;
        } else if (starsToDraw < starPos && starsToDraw > starPos - 1 && halfIcon) {
          return <FontAwesomeIcon key={starPos} icon={halfIcon} />;
        } else if (emptyIcon) {
          return <FontAwesomeIcon key={starPos} icon={emptyIcon} />;
        }
        return null
      }) : zeroIcon && <FontAwesomeIcon icon={zeroIcon} />}
    </div>
  );
};

export default Stars;
