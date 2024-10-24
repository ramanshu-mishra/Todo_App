import {atom, selector} from 'recoil';

export const todoList = atom({
    key : "todoList",
    default : []
})

export const selectTodo = atom({
    key : "selectTodo",
    default : "1"
})

export const todoFilter = selector({
    key : "todoFilter",
    get : ({get})=>{
        const todos = get(todoList);
        const selectTodos = get(selectTodo);
        if(selectTodos == 2){
            return todos.filter(i=>i.status == true);
        }
        else if(selectTodos == 3){
            return todos.filter(i=>i.status == false);
        }
        else{
            return todos
        }
    }
})

