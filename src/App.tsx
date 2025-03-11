import React, { useRef, useState } from "react";
import { EditIcon, ArrowRight, CloseIcon, BackIcon } from "./Icons";
import { useNavigate, useParams } from "react-router-dom";
import { List, Todo, useLists, useLocalStorage } from "./hooks";


function App() {
    return <ListPage />;
    // <TodoPage />

}

function ListItem({ list, deleteList }: { list: List, deleteList: (id:string) => void }) {
    const completed = list.todos.filter(t => t.completed === "done").length;
    const percentage = Math.round(completed * 100 / list.todos.length);
    const navigate = useNavigate();

    return <div className="list">
        <div className="list-title">
            <span className="title">{list.name}</span>
            <div>
                <button className="btn">
                    <EditIcon />
                </button>
                <button className="btn" onClick={() => navigate(`/lists/${list.id}`)}>
                    <ArrowRight />
                </button>
                <button className="btn" onClick={() => deleteList(list.id)}>
                    <CloseIcon />
                </button>
            </div>
        </div>

        <div className="bar">
            <span className="percentage" style={{ width: `${percentage}%` }}>
                <span className="tooltip">{percentage}%</span>
            </span>
        </div>
    </div>
}

export function ListPage() {

    const [lists, addList, updateList, deleteList] = useLists();

    return <>
        <h1>SAW TODO</h1>
        <div className="container">
            <input type="text"
                className="text-input"
                placeholder="Inserisci lista..." />
            {lists.map(l => <ListItem key={l.id} list={l} deleteList={deleteList}/>)}
        </div>
    </>
}


function TodoItem({ todo, deleteTodo, updateTodo }: { todo: Todo, deleteTodo: (id: string) => void, updateTodo: (t: Todo) => void }) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const textInput = useRef<HTMLInputElement>(null);

    const onKeyUp = (e: React.KeyboardEvent) => {
        const text = textInput.current!.value;

        if (text.trim() === "") {
            return;
        }

        if (e.key === "Enter") {
            updateTodo({ ...todo, text });
            setEditMode(false);
            return;
        }

        if (e.key === "Escape") {
            setEditMode(false);
            return;
        }
    }

    return <div className="item">
        {editMode
            ? <input ref={textInput} onKeyUp={onKeyUp} className="text-input" type="text" defaultValue={todo.text} />
            : <div>
                <input type="checkbox"
                    onChange={() => updateTodo({
                        id: todo.id,
                        text: todo.text,
                        completed: todo.completed === "done" ? "ongoing" : "done",
                    })}
                    checked={todo.completed === "done"} />
                <span
                    onDoubleClick={() => setEditMode(true)}
                    className={
                        todo.completed === "done"
                            ? "completed"
                            : ""}>
                    {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>&times;</button>
            </div>
        }
    </div>
}

export function TodoPage() {
    const params = useParams();
    const navigate = useNavigate();
    const [todos, setTodos] = useState<Todo[]>([
        { id: "1", text: "Inviare mail proposta progetto", completed: "done" },
        { id: "2", text: "Attendere Ack", completed: "ongoing" },
        { id: "3", text: "Sviluppare progetto", completed: "ongoing" },
        { id: "4", text: "Iscriversi ad un appello", completed: "ongoing" },
        { id: "5", text: "Rispondere correttamente all'esame", completed: "ongoing" },
        { id: "6", text: "Festeggiare", completed: "ongoing" },
    ]);
    const textInput = useRef<HTMLInputElement>(null);

    const deleteTodo = (id: string) => setTodos(p => p.filter(t => t.id !== id));
    const updateTodo = (newTodo: Todo) => setTodos(prev => prev.map(t => t.id === newTodo.id ? newTodo : t));

    const onKeyUp = (e: React.KeyboardEvent) => {
        const text = textInput.current!.value;

        if (text.trim() === "") {
            return;
        }

        if (e.key === "Enter") {
            const todo: Todo = {
                id: window.crypto.randomUUID(),
                text,
                completed: "ongoing",
            }

            setTodos(p => [...p, todo]);
            textInput.current!.value = "";
        }

        if (e.key === "Escape") {
            textInput.current!.value = "";
            return;
        }
    }

    return <>
        <header>
            <h1>SAW TODO {params.id}</h1>
            <h2>HTML</h2>
            <button className="btn" onClick={() => navigate("/")}>
                <BackIcon />
            </button>
        </header>
        <div className="container">
            <input
                onKeyUp={onKeyUp}
                ref={textInput}
                type="text"
                className="text-input"
                placeholder="Inserisci todo..." />

            <section className="todos">
                <ul>
                    {todos.map(t => <li key={t.id}>
                        <TodoItem
                            todo={t}
                            deleteTodo={deleteTodo}
                            updateTodo={updateTodo} />
                    </li>)}
                </ul>
            </section>
        </div>
    </>
        ;
}
export default App
