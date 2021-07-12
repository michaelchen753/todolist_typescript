import React from 'react';
import styles from './ListItem.module.css';
import { ListItemInterface } from '../../utils/Interface';
export default function ListItem(props:ListItemInterface) {
    const {title, completed, id} = props.todo;
    return (
        <div className='list-item'>           
           <div className='item-title'>
                <input 
                    type='checkbox' 
                    checked={completed}
                    data-testid={`checkbox-${id}`}
                    name={`checkbox-${id}`} 
                    onChange={()=> props.updateTodos(id)}
                />
                <label 
                    htmlFor={`checkbox-${id}`}
                    data-testid={`labelOfCheckbox-${id}`}
                    onClick={()=> props.updateTodos(id)}
                    className={`${completed? styles.completed:''}`}
                 >{title}
                </label> 
           </div>
           <button 
                className={styles.closeBtn}
                data-testid={`closeBtn-${id}`}
                onClick = {()=> props.deleteTodo(id)}
            >
                &#10006;
            </button>           
        </div>
    )
}
