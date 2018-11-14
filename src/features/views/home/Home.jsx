// flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView
}                         from '../../../common/components';
import { Alert, Glyphicon, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Home extends PureComponent {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    actions: PropTypes.shape({
      enterHome: PropTypes.func,
      leaveHome: PropTypes.func,
      fetchTodos: PropTypes.func
    })
  };

  componentWillMount() {
    const { actions: { enterHome } } = this.props;
    enterHome();
    this.props.fetchTodos();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    const { actions: { leaveHome } } = this.props;
    leaveHome();
  }

  render() {
    const todoState = this.props.mappedTodoState;
    const todos = todoState;
    console.log(todos);

    const {
    } = this.props;

    return(
      <AnimatedView>
        <div className="nothing">Dashboard preview</div>

        <div className="col-md-12">
          {!todos && todoState.isFetching &&
                    <p>Loading todos....</p>
          }
          {todos.length <= 0 && !todoState.isFetching &&
                    <p>No Todos Available. Add A Todo to List here.</p>
          }
          { todos.length > 0 && !todoState.isFetching &&
                    <table className="table booksTable">
                      <thead>
                        <tr><th>Todo</th><th className="textCenter">Edit</th><th className="textCenter">Delete</th><th className="textCenter">View</th></tr>
                      </thead>
                      <tbody>
                        {todos.map((todo, i) => (<tr key={i}>
                          <td>{todo.PlantId}</td>
                          <td className="textCenter"><Button bsStyle="info" bsSize="xsmall"><Glyphicon glyph="pencil" /></Button></td>
                          <td className="textCenter"><Button bsStyle="danger" bsSize="xsmall"><Glyphicon glyph="trash" /></Button></td>
                          <td className="textCenter"><Link to={`/${todo._id}`}>View Details</Link> </td>
                        </tr>))
                        }
                      </tbody>
                    </table>
          }
        </div>
      </AnimatedView>
    );
  }
}

export default Home;
