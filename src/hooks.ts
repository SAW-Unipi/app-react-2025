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
        id: "1",
        name: "Checklist Progetto",
        todos: [
            {
                id: "1",
                text: "Inviare mail proposta progetto",
                completed: "done",
            },
            { id: "2", text: "Attendere Ack", completed: "ongoing" },
            { id: "3", text: "Sviluppare progetto", completed: "ongoing" },
            { id: "4", text: "Iscriversi ad un appello", completed: "ongoing" },
            {
                id: "5",
                text: "Rispondere correttamente all'esame",
                completed: "ongoing",
            },
            { id: "6", text: "Festeggiare", completed: "ongoing" },
        ],
    },
    {
        id: "2",
        name: "Dev Roadmap",
        todos: [
            {
                id: "7",
                text: "Scegliere un linguaggio di progammazione",
                completed: "done",
            },
            { id: "8", text: "Imparare linguaggio", completed: "done" },
            {
                id: "9",
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

export function useTodos(listId: string) : [Todo[], ] {
    const [list] = useLists();
    const [todo, setTodo] = useState(list.find(l => l.id == listId)?.todos || []);

    return [todo, setTodo];
}