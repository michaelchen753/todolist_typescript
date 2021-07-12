import React from 'react';
import ListItem from '../ListItem/ListItem';
import { TodoListInterface } from '../../utils/Interface';

export default function TodoList(props:TodoListInterface) {
    return (
        <div className='todo-list'>
            <ol>
                {
                    props.todos.map((todo,index)=>{
                        const{id} = todo;
                        return (                            
                            <li key={id}>
                                 <ListItem 
                                    todo={todo} 
                                    updateTodos={props.updateTodos} 
                                    deleteTodo={props.deleteTodo}                            
                                    />
                            </li>                           
                        )
                    })
                }
            </ol>    
        </div>
    )
};
