// @flow weak

import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as viewsActions      from '../../../app/redux/modules/views';
import * as userAuthActions   from '../../../app/redux/modules/userAuth';
import Login                  from './Login.jsx';

const mapStateToProps = (state) => {
  return {
    // views:
    currentView:  state.views.currentView,

    // useAuth:
    isAuthenticated: state.userAuth.isAuthenticated,
    isFetching:      state.userAuth.isFetching,
    isLogging:       state.userAuth.isLogging

  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      // views:
      ...viewsActions,
      // userAuth:
      ...userAuthActions
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
