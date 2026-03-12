"use client";

import { useRef } from "react";
import { addTodo } from "@/app/actions";
import { css } from "../../styled-system/css";

export default function AddTodoForm() {
  const ref = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addTodo(formData);
    ref.current?.reset();
  }

  return (
    <form ref={ref} action={handleSubmit} className={css({ display: "flex", flexDir: "column", gap: "2" })}>
      <textarea
        name="content"
        placeholder="What needs to be done?"
        rows={4}
        required
        className={css({
          resize: "vertical",
          p: "3",
          borderRadius: "md",
          border: "1px solid",
          borderColor: "gray.300",
          fontSize: "md",
          fontFamily: "inherit",
          outline: "none",
          _focus: { borderColor: "blue.500", boxShadow: "0 0 0 2px token(colors.blue.200)" },
        })}
      />
      <button
        type="submit"
        className={css({
          alignSelf: "flex-end",
          px: "4",
          py: "2",
          bg: "blue.500",
          color: "white",
          borderRadius: "md",
          fontWeight: "semibold",
          cursor: "pointer",
          border: "none",
          _hover: { bg: "blue.600" },
        })}
      >
        Add Todo
      </button>
    </form>
  );
}
