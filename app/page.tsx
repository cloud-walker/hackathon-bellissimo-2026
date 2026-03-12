import { db } from "@/lib/db";
import { css } from "../styled-system/css";
import AddTodoForm from "./components/AddTodoForm";
import TodoItem from "./components/TodoItem";

export default async function Home() {
  const todos = await db.todo.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main
      className={css({
        maxW: "600px",
        mx: "auto",
        px: "4",
        py: "10",
        display: "flex",
        flexDir: "column",
        gap: "8",
      })}
    >
      <h1 className={css({ fontSize: "2xl", fontWeight: "bold", color: "gray.900" })}>
        Todos
      </h1>
      <AddTodoForm />
      {todos.length === 0 ? (
        <p className={css({ color: "gray.400", textAlign: "center", py: "8" })}>
          No todos yet. Add one above.
        </p>
      ) : (
        <ul className={css({ display: "flex", flexDir: "column", gap: "2", listStyle: "none", p: "0", m: "0" })}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </main>
  );
}
