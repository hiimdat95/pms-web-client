import {
  getListPlant
} from '../../../app/services/API';

export const fetchTodosRequest = () => {
  return {
    type: 'FETCH_TODOS_REQUEST'
  };
};
// Sync action
export const fetchTodosSuccess = (todos ) => {
  return {
    type: 'FETCH_TODOS_SUCCESS',
    todos: todos,
    // message: message,
    receiveAt: Date.now
  };
};

export const fetchTodosFailed = (error) => {
  return {
    type: 'FETCH_TODOS_FAILED',
    error
  };
};


export function fetchTodos() {
  return async (dispatch) => {
    dispatch(fetchTodosRequest());
    try {
      const data =  await getListPlant();
      console.log(data);

      return dispatch(fetchTodosSuccess(data));
    } catch (error) {
      return dispatch(fetchTodosFailed(error));
    }
  };
}
// Async action
// export const fetchTodos = () => {
//   return (dispatch) => {
//     dispatch(fetchTodosRequest());
//     // Returns a promise
//     return fetch(apiUrl)
//       .then(response => {
//         if (response.ok) {
//           console.log(response);
//           response.json().then(data => {
//             dispatch(fetchTodosSuccess(data.todos, data.message));
//           });
//         } else {
//           response.json().then(error => {
//             dispatch(fetchTodosFailed(error));
//           });
//         }
//       });
//   };
// };

