const express = require("express");
const router = express.Router();
const types = require("../types");
const todos = require("../db/db");

const moment = require("moment")



router.post("/todo", async (req,res)=>{
    const rawTodo = req.body.todo;
    console.log(rawTodo);
    const validatedTodo = types.createTodo(rawTodo);
    if(!validatedTodo.success){
        console.log("zod validation failed ")
        res.status(200).json({
            msg: "invalid inputs"
        })
    }
    else{
        try{
        await todos.create({
            title : validatedTodo.data.title,
            description: validatedTodo.data.description
        })
    }
     catch(e){
        console.log(e.message);
     }   
     console.log("todo Added succesfully")
        res.status(200).json({
            msg: "successfull creation",
            data : validatedTodo.data
        })
    }

})
    // getting all the todos
    router.get("/todos", async (req,res)=>{
    const todolist = await todos.find({});
    res.status(200).json({
        todos : todolist
    })
    })
    
    // marking as complete a specific todo
    router.put("/completed", async (req,res)=>{
    const rawid = req.body.id;
    // console.log(rawid);
    const validatedId = types.completeTodo(rawid);
    // console.log(validatedId);
    const todo = await todos.where({_id: validatedId.data});
    console.log(todo[0]);
    if (Object.entries(todo[0]).length != 0){
    if(todo[0].status == true){
        await todos.updateOne({_id: validatedId.data}, {status : false ,
            completeTime: null
        }
        )
    }
    else{
        let date = moment().format("DD-MM-YYYY HH:mm:ss");
        await todos.updateOne({_id: validatedId.data}, {status : true,
            completeTime: date
        })
    }
    res.status(200).json({
        msg: "todo status changed succesfully",
        data : todos.find({_id : validatedId.data})[0]
    })
}
else{
    res.status(200).json({
        msg: "todo not found"
    })
}
 })

 router.put("/delete" , async (req, res)=>{
    const id = req.body.id;
    const validatedId = types.completeTodo(id);
    if(validatedId.success){
        try{
        await todos.deleteOne({_id : validatedId.data});
        res.status(200).json({
            msg: "todo id: "+id+" deleted."
        })
        }
        catch{
            res.status(400).json({
                msg: "Could not delete"
            })
        }
        
    }
    else{
        res.status(400).json({
            msg : "Invalid Id"
        })
    }

 })

module.exports = {router}