const INITIAL_STATE = {
  todos: [],
  todo: null,
  isFetching: false,
  error: null,
  successMsg: null,
  showDeleteModal: false,
  todoToDelete: null,
  showEditModal: false,
  todoToEdit: null,
  newTodo: null
};
export default function todoReducer(currentState = INITIAL_STATE, action) {
  switch (action.type) {
  case 'FETCH_TODOS_REQUEST':
    return {
      ...currentState,
      todos: [],
      todo: null,
      isFetching: true,
      error: null,
      successMsg: null,
      showDeleteModal: false,
      todoToDelete: null,
      showEditModal: false,
      todoToEdit: null
    };
  case 'FETCH_TODOS_SUCCESS':
    return {
      ...currentState,
      todos: action.todos,
      todo: null,
      isFetching: false,
      error: null,
      successMsg: action.message,
      showDeleteModal: false,
      todoToDelete: null,
      showEditModal: false,
      todoToEdit: null
    };
  case 'FETCH_TODOS_FAILED':
    return {
      ...currentState,
      todos: [],
      todo: null,
      isFetching: false,
      error: action.error,
      successMsg: null,
      showDeleteModal: false,
      todoToDelete: null,
      showEditModal: false,
      todoToEdit: null
    };
  default:
    return currentState;
  }
}
