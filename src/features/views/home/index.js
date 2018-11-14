// @flow weak

import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../../app/redux/modules/actions';
import * as todoActions       from './todoActions';
import Home                   from './Home.jsx';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    mappedTodoState: state.todoReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterHome: actions.enterHome,
        leaveHome: actions.leaveHome
      },
      dispatch),
    fetchTodos: () => dispatch(todoActions.fetchTodos())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
