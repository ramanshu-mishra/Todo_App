import { useEffect, useState } from 'react'
import "./App.css"
import {fetchData, Server_URL} from "./functions";
import {RecoilRoot, useRecoilState , useRecoilValue , useSetRecoilState} from 'recoil';
import {todoList , todoFilter, selectTodo} from "./states"


function App() {
  
  return (
    <>
    <RecoilRoot>
    <AddTodo></AddTodo>
    <DisplayCanvas></DisplayCanvas>
    </RecoilRoot>
    </>
  )
}

function AddTodo(){

  const setTodos = useSetRecoilState(todoList);
  useEffect(()=>{
    const fetched = fetchData(Server_URL + "/todos");
    fetched.then(
       (res)=>{
        setTodos(res.todos)  
      }
    )
    
  }, [])


  const [title, setTitle] = useState("");
  const [description , setDescription] = useState("");
  // const setTodos = useSetRecoilState(todoList);

return (
  <>
  <div style={{
    background: "linear-gradient( skyblue, white)", display : "flex" , justifyContent : "center" , height : "70px" ,alignItems : "center" , fontSize : "2rem", 
    
  }}>MISHRA TODO APP</div>
  <div style={{
    background : "linear-gradient(white , skyblue)", display: "flex", height : "70px" , alignItems : "center"
  }}>
    <input type='text' placeholder='Enter your Todo Title Here' onChange={(e)=>{setTitle(e.target.value)}} style={{width : "20vw", height: "50%", marginLeft : "10px"}}></input>
    <input type='text' placeholder='Enter your Todo Description Here' onChange={(e)=>{setDescription(e.target.value)}} style={{width : "40vw", marginLeft : "10px", height : "50%"}}></input>
    <button onClick={async ()=>{
      if(title && description){
      try{
      const res = await fetch(Server_URL + "/todo", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({ "todo" : {
          title : title,
          description : description
        }})
      })
      if(!res.ok){
        throw new Error ('Could not create new Todo');
      }
      
        const fetched = fetchData(Server_URL + "/todos");
        fetched.then(
           (res)=>{
            setTodos(res.todos)  
          }
        )
        setTitle("");
        setDescription("");
        const t = document.querySelectorAll("input");
        for(let i = 0; i < t.length ; i++){
          t[i].value = "";
        }
    }
    catch(e){
      console.log(e.message);
    }}}} style={{ position : "relative" , backgroundColor : "white", minWidth : "100px", maxWidth : '10vw' , marginLeft : "10px" , borderRadius : "10px", height : "50%" }}>ADD</button>
    <SelectFilter></SelectFilter>
  </div>
  </>
)
}
function DisplayCanvas(){
const todos = useRecoilValue(todoFilter);
return( 
  <>
{todos.map(i=>{
  return (
    <div style={{display : "flex" , justifyContent: "center"}}>
    <div style={{width : "80vw", marginTop : "10px"}}>
    <TodoWrapper>
      <Todo key={i._id} id = {i._id}title = {i.title} description = {i.description} status = {i.status}></Todo>
    </TodoWrapper>
    </div>
    </div> 
  )
})}
</>
)
}

function TodoWrapper({children}){
return (
  <div style={{border : "1px solid balck" , boxShadow : "0px 2px 5px grey", display: "flex" , justifyContent : "space-between ", height: "fit-content"}}>
    {children}
  </div>
)
}

function Todo({title ,description, id , status}){
const setTodos = useSetRecoilState(todoList);
return(
  <>
  <div style={{height : "100%"}}>
  <div>{title}</div>
  <div>{description}</div>
  </div>
  <div style={{ display : "flex", alignItems : "center" }}>
  <button onClick={async ()=>{
    console.log(id);
    const fetched = await fetch(Server_URL + "/completed", {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        id : id
      })
    });
    const data = await fetched.json();
    console.log(data);

    const revised = fetchData(Server_URL + "/todos");
    revised.then(
       (res)=>{
        setTodos(res.todos)  
      }
    )
    
  }} style={{color: status ? "green" : "red" , width : "5vw", minWidth : "fit-Content", height : "fit-content", borderRadius : "10px"}}> {(status) ? "Done" : "X"}</button>
  <button onClick={async ()=>{
    const fetched = await fetch(Server_URL + "/delete" , {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        id : id
      })

    });
    const data = await fetched.json();
    console.log(data);

    const revised = fetchData(Server_URL + "/todos");
    const newtodos = await revised;
    setTodos(newtodos.todos);

  }} style={{borderRadius : "10px",backgroundColor : "pink", height : "fit-content" , marginLeft : "10px" , marginRight : "10px" , width : "5vw" , minWidth : "fit-content"}}>Remove</button>
  </div>
  </>
)
}

function SelectFilter(){
  const selectTodos = useSetRecoilState(selectTodo);
  return(
    <div style={{position : 'absolute' , right : "10px"}}>
    FILTER : <select onChange={(e)=>{selectTodos(e.target.value)}}>
      <option value="1">Show All</option>
      <option value = '2'>Show Completed</option>
      <option value = '3'>Show Incomplete</option>
    </select>
   

    </div>
  )
} 



export default App
