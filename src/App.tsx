import React, { useState, useEffect } from 'react';
import Http from './utils/Http';
import TodoList from './components/TodoList/TodoList';
import './App.css';
import { TodoInterface } from './utils/Interface';


export default function App() {

  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await Http.get('/todos');      
      console.log('result',result);
      setTodos(result.data.slice(0, 5));
      setLoading(false);      
    }
    fetchData();
  }, []);


  const addNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!name){
      alert('Please enter a todo.');
      return; 
    };   
    const newTodo = {
      userId: 2,
      id: new Date().getTime().toString(),
      title: name,
      completed: [false, true][Math.floor(Math.random()*2)]
    };
    
    setSaving(true);

  try {
    const response = await Http.post('/todos', { newTodo });
    console.log('response',response);

    setSaving(false);
    setTodos(todos=>[
      ...todos,
      { ...response.data.newTodo, id: newTodo.id},
    ]);

  } catch(e) {
    setSaving(false);
    setError(e?.message);
  };
  }
  const updateTodos = (id:string) =>{
    const todoLists = todos.map((todo)=>{
      if(todo.id === id) {
        const updatedTodo = {...todo, completed: !todo.completed };
        return updatedTodo;
      }
      return todo;
    });
    setTodos(todoLists);
  }

  const deleteTodo =( id:string )=>{
    const todosTobeKept = todos.filter(todo => todo.id !== id);
    setTodos(todosTobeKept);
  };
 

console.log('todos',todos);

  return (
    <div className="App">
      <h1 className="header">My todo list</h1>
     
      <div className='add-todo-form'>
        {
          saving ? 
          <div>Saving...</div>
          :(
            <div>
              {error && <div>{error}</div>}
              <form onSubmit={addNewTodo}>
                <label htmlFor="todoTitle">Title:</label>
                <input 
                  type='text' 
                  id='todoTitle'
                  data-testid='todoTitle'
                  onChange={e => setName(e.target.value)}
                  placeholder='enter todo here...'
                />
                <button
                  type='submit'
                >
                  Add new todo
                </button>
              </form>
            </div>
          )
        }
      </div>
         { 
       loading? 
        <h2>Loading...</h2>: <TodoList todos={todos} deleteTodo={deleteTodo} updateTodos={updateTodos}/>
        }          
    </div>
  );
};