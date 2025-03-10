import React, { useRef, useState } from "react";

interface Todo {
    id: string;
    completed: 'done' | 'ongoing';
    text: string;
}

function App() {
    return <TodoPage />

}

function BackIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512">
        <path
            d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM217.4 376.9L117.5 269.8c-3.5-3.8-5.5-8.7-5.5-13.8s2-10.1 5.5-13.8l99.9-107.1c4.2-4.5 10.1-7.1 16.3-7.1c12.3 0 22.3 10 22.3 22.3l0 57.7 96 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32l-96 0 0 57.7c0 12.3-10 22.3-22.3 22.3c-6.2 0-12.1-2.6-16.3-7.1z" />
    </svg>
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

function TodoPage() {
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
            <h1>SAW TODO</h1>
            <h2>HTML</h2>
            <button className="btn">
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
