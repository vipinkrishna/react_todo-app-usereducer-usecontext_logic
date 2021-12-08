import React, { useState, useReducer, useContext, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useCombinedReducers from 'use-combined-reducers';
import './App.css';

const DispatchContext = createContext(null);

const initialTodos = [
  {
    id: uuidv4(),
    task: 'Learn React',
    complete: true,
  },
  {
    id: uuidv4(),
    task: 'Learn Firebase',
    complete: true,
  },
  {
    id: uuidv4(),
    task: 'Learn GraphQL',
    complete: false,
  },
];

const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_ALL':
      return 'ALL';
    case 'SHOW_COMPLETE':
      return 'COMPLETE';
    case 'SHOW_INCOMPLETE':
      return 'INCOMPLETE';
    default:
      return state;
  }
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'DO_TODO':
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
    case 'UNDO_TODO':
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    case 'ADD_TODO':
      return state.concat({
        task: action.task,
        id: action.id,
        complete: false,
      });
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useCombinedReducers({
    filter: useReducer(filterReducer, 'ALL'),
    todos: useReducer(todoReducer, initialTodos),
  });

  const { filter, todos } = state;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'ALL') {
      return true;
    }

    if (filter === 'COMPLETE' && todo.complete) {
      return true;
    }

    if (filter === 'INCOMPLETE' && !todo.complete) {
      return true;
    }

    return false;
  });

  return (
    <div className="todo-app">
      <DispatchContext.Provider value={dispatch}>
        <Filter />
        <TodoList todos={filteredTodos} />
        <AddTodo />
      </DispatchContext.Provider>
    </div>
  );
};

const Filter = () => {
  const dispatch = useContext(DispatchContext);

  const handleShowAll = () => {
    dispatch({ type: 'SHOW_ALL' });
  };

  const handleShowComplete = () => {
    dispatch({ type: 'SHOW_COMPLETE' });
  };

  const handleShowIncomplete = () => {
    dispatch({ type: 'SHOW_INCOMPLETE' });
  };

  return (
    <div className="filter-buttons">
      <button type="button" onClick={handleShowAll}>
        Show All Todos
      </button>
      <button type="button" onClick={handleShowComplete}>
        Show Done Todos
      </button>
      <button type="button" onClick={handleShowIncomplete}>
        Show UnDone Todos
      </button>
    </div>
  );
};

const TodoList = ({ todos }) => (
  <ul>
    {todos.map((todo) => (
      <TodoItem key={todo.id} todo={todo} />
    ))}
  </ul>
);

const TodoItem = ({ todo }) => {
  const dispatch = useContext(DispatchContext);

  const handleChange = () =>
    dispatch({
      type: todo.complete ? 'UNDO_TODO' : 'DO_TODO',
      id: todo.id,
    });

  return (
    <>
      <li
        className={'todo-item' + (todo.complete ? ' checked' : '')}
        onClick={handleChange}
        checked={todo.complete}
      >
        <span>{todo.task}</span>
        <span>
          {todo.complete ? (
            <span style={{ color: 'lightgreen' }}>&#10004;</span>
          ) : (
            ''
          )}
        </span>
      </li>
    </>
  );
};

const AddTodo = () => {
  const dispatch = useContext(DispatchContext);

  const [task, setTask] = useState('');

  const handleSubmit = (event) => {
    if (task) {
      dispatch({ type: 'ADD_TODO', task, id: uuidv4() });
    }

    setTask('');

    event.preventDefault();
  };

  const handleChange = (event) => setTask(event.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={task} onChange={handleChange} />
      <button type="submit">+ &nbsp; Add</button>
    </form>
  );
};

export default App;
