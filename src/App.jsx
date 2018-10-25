import React, { Component } from 'react';
import { Provider } from "react-redux";
// import PropTypes from 'prop-types';
import { BrowserRouter } from "react-router-dom";
import configureStore from './store/configureStore';
import Router from './routes';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
const store = configureStore();


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div >
                    <BrowserRouter>
                        <Router />
                    </BrowserRouter>
                </div>
            </Provider>
        );
    }
}

// App.propTypes = {
//   store: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired
// }

export default App;
