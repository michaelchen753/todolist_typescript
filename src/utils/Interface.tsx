export interface TodoInterface {
    userId:string;
    completed:boolean;
    id:string;
    title:string;
}


export interface TodoListInterface {
    todos:TodoInterface[];
    updateTodos:(id:string) => void;
    deleteTodo:(id:string) => void;
}


export interface ListItemInterface {
    todo:TodoInterface;
    updateTodos:(id:string) => void;
    deleteTodo:(id:string) => void;

}