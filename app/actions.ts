"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { classifyTask } from "@/lib/gemini";
import { lara } from "@/lib/lara";

export async function addTodo(formData: FormData) {
  const content = formData.get("content") as string;
  if (!content?.trim()) return;

  const trimmed = content.trim();

  const [{ tag, reasoning }, translation] = await Promise.all([
    classifyTask(trimmed),
    lara.translate(trimmed, null, "en"),
  ]);

  await db.todo.create({
    data: {
      content: trimmed,
      tag,
      reasoning,
      detectedLanguage: translation.sourceLanguage,
      translatedContent:
        translation.sourceLanguage === "en" ? null : (translation.translation as string),
    },
  });

  revalidatePath("/");
}

export async function toggleTodo(id: number, done: boolean) {
  await db.todo.update({ where: { id }, data: { done: !done } });
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await db.todo.delete({ where: { id } });
  revalidatePath("/");
}
