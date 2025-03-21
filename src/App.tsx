import React, { useRef, useState } from "react";
import { EditIcon, ArrowRight, CloseIcon, BackIcon } from "./Icons";
import { useNavigate, useParams } from "react-router-dom";
import { List, Todo, useLists, useTodos } from "./hooks";


function App() {
    return <ListPage />;
    // <TodoPage />

}

function ListItem({ list, deleteList, updateList }: { list: List, deleteList: (id: string) => void, updateList: (l: List) => void }) {
    const completed = list.todos.filter(t => t.completed === "done").length;
    const percentage = Math.round(completed * 100 / list.todos.length) || 0;
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const textInput = useRef<HTMLInputElement>(null);

    const onKeyUp = (e: React.KeyboardEvent) => {
        const name = textInput.current!.value;

        if (name.trim() === "") {
            return;
        }

        if (e.key === "Enter") {
            updateList({ ...list, name });
            setEditMode(false);
            return;
        }

        if (e.key === "Escape") {
            setEditMode(false);
            return;
        }
    }
    return <div className="list">
        <div className="list-title">
            {editMode
                ? <input type="text" onKeyUp={onKeyUp} ref={textInput} defaultValue={list.name}/>
                : <span className="title">{list.name}</span>
            }
            <div>
                <button className="btn" onClick={() => setEditMode(true)}>
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
    const textInput = useRef<HTMLInputElement>(null);
    const onKeyUp = (e: React.KeyboardEvent) => {
        const name = textInput.current!.value;

        if (name.trim() === "") {
            return;
        }

        if (e.key === "Enter") {
            addList(name);
            textInput.current!.value = "";
        }

        if (e.key === "Escape") {
            textInput.current!.value = "";
            return;
        }
    }
    return <>
        <h1>SAW TODO</h1>
        <div className="container">
            <input type="text"
                ref={textInput}
                onKeyUp={onKeyUp}
                className="text-input"
                placeholder="Inserisci lista..." />
            {lists.map(l => <ListItem key={l.id} list={l} deleteList={deleteList} updateList={updateList} />)}
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
    const [todos, deleteTodo, updateTodo, addTodo] = useTodos(params.id!)

    const textInput = useRef<HTMLInputElement>(null);

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
            addTodo(todo);
            textInput.current!.value = "";
        }

        if (e.key === "Escape") {
            textInput.current!.value = "";
            return;
        }
    }

    return <>
        <header>
            <h1>SAW TODO</h1>
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
