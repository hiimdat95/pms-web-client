import React, { Component } from 'react';
import { Provider } from "react-redux";
import PropTypes from 'prop-types';
import configureStore from './store/configureStore';
import routes from './routes';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
const store = configureStore();


class App extends Component {
    render() {
        return (
            <Provider store={store}>
            </Provider>
        );
    }
}

// App.propTypes = {
//   store: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired
// }

export default App;
