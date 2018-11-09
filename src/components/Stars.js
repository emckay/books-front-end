import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import {UncontrolledTooltip} from 'reactstrap';
import _ from 'lodash';
import {
  faMinus as ZeroIcon,
  faQuestion as MissingIcon,
} from '@fortawesome/pro-light-svg-icons';

class Stars extends React.Component {
  static defaultProps = {
    emptyIcon: null,
    halfIcon: null,
    zeroIcon: ZeroIcon,
    missingIcon: MissingIcon,
  };

  constructor(props) {
    super(props);
    this.id = _.uniqueId('stars');
  }

  render() {
    const {
      className,
      count,
      percentile,
      fullIcon,
      emptyIcon,
      halfIcon,
      zeroIcon,
      missingIcon,
      tooltip: tooltipOverride,
    } = this.props;

    let starsToDraw;
    let children;
    let tooltipContent = count || `${Math.round(percentile * 100)}%`;
    if (halfIcon) {
      // round to nearest 0.5
      starsToDraw = count
        ? Math.round(count * 2) / 2
        : Math.ceil(percentile * 10) / 2;
    } else {
      starsToDraw = count ? Math.round(count) : Math.ceil(percentile * 5);
    }

    if (_.isNil(count) && _.isNil(percentile)) {
      children = <FontAwesomeIcon icon={missingIcon} />;
      tooltipContent = 'Data missing';
    } else if (starsToDraw === 0) {
      children = <FontAwesomeIcon icon={ZeroIcon} />;
    } else {
      children = [1, 2, 3, 4, 5].map((starPos) => {
        if (starsToDraw >= starPos) {
          return <FontAwesomeIcon key={starPos} icon={fullIcon} />;
        } else if (
          starsToDraw < starPos &&
          starsToDraw > starPos - 1 &&
          halfIcon
        ) {
          return <FontAwesomeIcon key={starPos} icon={halfIcon} />;
        } else if (emptyIcon) {
          return <FontAwesomeIcon key={starPos} icon={emptyIcon} />;
        }
        return null;
      });
    }

    return (
      <React.Fragment>
        <UncontrolledTooltip placement="left" target={this.id} delay={0}>
          {tooltipOverride || tooltipContent}
        </UncontrolledTooltip>
        <div className={classnames(className, 'stars')} id={this.id}>
          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default Stars;
