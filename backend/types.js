const z = require("zod");
/* 
posting a todo
    {
        title: string,
        description : string
    }

marking as complete 
{
id : string
}
*/
const post_schema = z.object({
    title: z.string().trim(),
    description: z.string().trim()
}
)

const put_schema = z.string().trim();

function createTodo(data){
    
return post_schema.safeParse(data);

}


function completeTodo(data){
    return put_schema.safeParse(data);
}



module.exports = {
    createTodo, completeTodo
}


