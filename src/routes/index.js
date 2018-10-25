import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import App from '../containers/App';
import Todos from '../containers/Todos';
import Todo from '../containers/Todo';

export const Router = () => (
    <Switch>
        <Route path="/" exact component={App} />
        <Route path='/:id' component={Todo} />
    </Switch>
);

export default Router;