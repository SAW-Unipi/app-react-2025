import { useEffect, useState } from "react";

export interface Todo {
    id: string;
    completed: "done" | "ongoing";
    text: string;
}

export interface List {
    id: string;
    name: string;
    todos: Todo[];
}

const db: List[] = [
    {
        id: "l-1",
        name: "Checklist Progetto",
        todos: [
            {
                id: "t-1",
                text: "Inviare mail proposta progetto",
                completed: "done",
            },
            { id: "t-2", text: "Attendere Ack", completed: "ongoing" },
            { id: "t-3", text: "Sviluppare progetto", completed: "ongoing" },
            {
                id: "t-4",
                text: "Iscriversi ad un appello",
                completed: "ongoing",
            },
            {
                id: "t-5",
                text: "Rispondere correttamente all'esame",
                completed: "ongoing",
            },
            { id: "t-6", text: "Festeggiare", completed: "ongoing" },
        ],
    },
    {
        id: "l-2",
        name: "Dev Roadmap",
        todos: [
            {
                id: "t-7",
                text: "Scegliere un linguaggio di progammazione",
                completed: "done",
            },
            { id: "t-8", text: "Imparare linguaggio", completed: "done" },
            {
                id: "t-9",
                text: "Sviluppare un progetto di esempio",
                completed: "ongoing",
            },
        ],
    },
];

function getItem<T>(key: string, initialValue: T): T {
    const item = localStorage.getItem(key);

    if (item) {
        return JSON.parse(item);
    }

    if (initialValue instanceof Function) {
        return initialValue();
    }

    return initialValue;
}

export function useLocalStorage<T>(
    key: string,
    v: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [item, setItem] = useState(getItem(key, v));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(item));
    }, [item]);

    return [item, setItem];
}

export function useLists(): [
    List[],
    (name: string) => void,
    (l: List) => void,
    (id: string) => void,
] {
    const [lists, setLists] = useLocalStorage<List[]>("lists", db);

    const updateList = (l: List) =>
        setLists((p) => p.map((i) => i.id === l.id ? l : i));

    const deleteList = (id: string) => {
        setLists((p) => p.filter((l) => l.id !== id));
    };
    const addList = (name: string) => {
        const l: List = {
            id: window.crypto.randomUUID(),
            name,
            todos: [],
        };

        setLists((p) => [...p, l]);
    };

    return [lists, addList, updateList, deleteList];
}

export function useTodos(
    listId: string,
): [Todo[], (id: string) => void, (id: Todo) => void, (t: Todo) => void] {
    const [lists, , updateList] = useLists();
    const [list, setList] = useState(lists.find((l) => l.id == listId));
    const [todos, setTodos] = useState(list?.todos || []);

    useEffect(() => {
        setList(lists.find((l) => l.id == listId));
    }, [lists, listId]);

    useEffect(() => setTodos(list?.todos || []), [list]);

    const addTodo = (newTodo: Todo) => {
        updateList({
            ...list!,
            todos: [...(list?.todos || []), newTodo],
        });
    };

    const deleteTodo = (id: string) =>
        updateList({
            ...list!,
            todos: (list?.todos || []).filter((t) => t.id !== id),
        });
    const updateTodo = (newTodo: Todo) =>
        updateList({
            ...list!,
            todos: (list?.todos || []).map((t) =>
                t.id === newTodo.id ? newTodo : t
            ),
        });

    return [todos, deleteTodo, updateTodo, addTodo];
}
