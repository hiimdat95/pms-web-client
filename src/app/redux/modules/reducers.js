// @flow weak

import { routerReducer }    from 'react-router-redux';
import { combineReducers }  from 'redux';
import sideMenu             from './sideMenu';
import userInfos            from './userInfos';
import views                from './views';
import userAuth             from './userAuth';
import todoReducer           from './todoReducer';

export const reducers = {
  sideMenu,
  userInfos,
  views,
  userAuth,
  todoReducer
};

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
