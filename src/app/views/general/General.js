// @flow weak

/* eslint no-console:0 */
import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import {
  AnimatedView,
  Panel,
  ToolTip,
  Pager,
  Button,
  Label
} from '../../components';

class General extends PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      enterGeneral: PropTypes.func,
      leaveGeneral: PropTypes.func
    })
  };

  componentWillMount() {
    this.props.actions.enterGeneral();
  }

  componentWillUnmount() {
    this.props.actions.leaveGeneral();
  }

  render() {
    return (
      <AnimatedView>
        <div>
          General
        </div>
      </AnimatedView>
    );
  }
}

export default General;
