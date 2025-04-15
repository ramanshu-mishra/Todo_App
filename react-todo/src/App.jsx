import { useEffect, useState } from 'react';
import "./App.css";
import { fetchData, Server_URL } from "./functions";
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { todoList, todoFilter, selectTodo } from "./states";

function App() {
  return (
    <RecoilRoot>
      <AddTodo />
      <DisplayCanvas />
    </RecoilRoot>
  );
}

function AddTodo() {
  const setTodos = useSetRecoilState(todoList);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchData(Server_URL + "/todos").then((res) => {
      setTodos(res.todos);
    });
  }, []);

  const handleAddTodo = async () => {
    if (title && description) {
      try {
        const res = await fetch(Server_URL + "/todo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todo: {
              title,
              description,
            },
          }),
        });

        if (!res.ok) throw new Error('Could not create new Todo');

        const data = await fetchData(Server_URL + "/todos");
        setTodos(data.todos);
        setTitle("");
        setDescription("");
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  return (
    <>
      <div style={{
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80px",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: "1.5px"
      }}>
        MISHRA TODO APP
      </div>

      <div style={{
        background: "linear-gradient(to right, #ffffff, #e0f7fa)",
        padding: "20px",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        flexWrap: "wrap",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "relative"
      }}>
        <input type='text' placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "20vw",
            minWidth: "200px"
          }}
        />

        <input type='text' placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "40vw",
            minWidth: "250px"
          }}
        />

        <button
          onClick={handleAddTodo}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffffff",
            color: "#00796b",
            border: "2px solid #00796b",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e0f2f1"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
        >
          ADD
        </button>

        <SelectFilter />
      </div>
    </>
  );
}

function DisplayCanvas() {
  const todos = useRecoilValue(todoFilter);
  return (
    <>
      {todos.map(i => (
        <div key={i._id} style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "80vw", marginTop: "10px" }}>
            <TodoWrapper>
              <Todo
                id={i._id}
                title={i.title}
                description={i.description}
                status={i.status}
              />
            </TodoWrapper>
          </div>
        </div>
      ))}
    </>
  );
}

function TodoWrapper({ children }) {
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "15px",
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      {children}
    </div>
  );
}

function Todo({ title, description, id, status }) {
  const setTodos = useSetRecoilState(todoList);

  const handleComplete = async () => {
    const fetched = await fetch(Server_URL + "/completed", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await fetched.json();
    console.log(data);

    const revised = await fetchData(Server_URL + "/todos");
    setTodos(revised.todos);
  };

  const handleDelete = async () => {
    const fetched = await fetch(Server_URL + "/delete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await fetched.json();
    console.log(data);

    const revised = await fetchData(Server_URL + "/todos");
    setTodos(revised.todos);
  };

  return (
    <>
      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontWeight: "600", fontSize: "18px", color: "#424242" }}>{title}</div>
        <div style={{ color: "#757575" }}>{description}</div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleComplete}
          style={{
            padding: "8px 16px",
            backgroundColor: status ? "#c8e6c9" : "#ffcdd2",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            color: status ? "#2e7d32" : "#c62828",
            cursor: "pointer"
          }}
        >
          {status ? "Done" : "X"}
        </button>

        <button
          onClick={handleDelete}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ffcccb",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            color: "#d32f2f",
            cursor: "pointer"
          }}
        >
          Remove
        </button>
      </div>
    </>
  );
}

function SelectFilter() {
  const selectTodos = useSetRecoilState(selectTodo);
  return (
    <div style={{
      position: 'absolute',
      right: "20px",
      // top: "90px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "16px"
    }}>
      FILTER:
      <select onChange={(e) => selectTodos(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}>
        <option value="1">Show All</option>
        <option value="2">Show Completed</option>
        <option value="3">Show Incomplete</option>
      </select>
    </div>
  );
}

export default App;
