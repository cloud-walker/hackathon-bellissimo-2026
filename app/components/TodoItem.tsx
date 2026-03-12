"use client";

import { toggleTodo, deleteTodo } from "@/app/actions";
import { css } from "../../styled-system/css";

type Todo = {
  id: number;
  content: string;
  done: boolean;
  tag: string | null;
  detectedLanguage: string | null;
  translatedContent: string | null;
};

export default function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li
      className={css({
        display: "flex",
        alignItems: "flex-start",
        gap: "3",
        p: "3",
        borderRadius: "md",
        bg: "gray.50",
        border: "1px solid",
        borderColor: "gray.200",
      })}
    >
      <button
        onClick={() => toggleTodo(todo.id, todo.done)}
        aria-label={todo.done ? "Mark as undone" : "Mark as done"}
        className={css({
          flexShrink: 0,
          mt: "0.5",
          w: "5",
          h: "5",
          borderRadius: "sm",
          border: "2px solid",
          borderColor: todo.done ? "blue.500" : "gray.400",
          bg: todo.done ? "blue.500" : "transparent",
          cursor: "pointer",
        })}
      />
      <div className={css({ flex: 1, display: "flex", flexDir: "column", gap: "2" })}>
        <div className={css({ display: "flex", flexDir: "column", gap: "0.5" })}>
          <span
            className={css({
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: todo.done ? "gray.400" : "gray.800",
              textDecoration: todo.done ? "line-through" : "none",
            })}
          >
            {todo.content}
          </span>
          {todo.detectedLanguage && (
            <span className={css({ fontSize: "xs", color: "gray.400" })}>
              {todo.detectedLanguage.toUpperCase()}
            </span>
          )}
        </div>

        {todo.translatedContent && (
          <div className={css({ display: "flex", flexDir: "column", gap: "0.5" })}>
            <span
              className={css({
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: todo.done ? "gray.400" : "gray.600",
                fontStyle: "italic",
                textDecoration: todo.done ? "line-through" : "none",
              })}
            >
              {todo.translatedContent}
            </span>
            <span className={css({ fontSize: "xs", color: "gray.400" })}>EN</span>
          </div>
        )}

        {todo.tag && (
          <span
            className={css({
              alignSelf: "flex-start",
              fontSize: "xs",
              fontWeight: "medium",
              px: "2",
              py: "0.5",
              borderRadius: "full",
              bg: "blue.100",
              color: "blue.700",
            })}
          >
            {todo.tag}
          </span>
        )}
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        aria-label="Delete todo"
        className={css({
          flexShrink: 0,
          color: "gray.400",
          cursor: "pointer",
          border: "none",
          bg: "transparent",
          fontSize: "lg",
          lineHeight: 1,
          _hover: { color: "red.500" },
        })}
      >
        ×
      </button>
    </li>
  );
}
