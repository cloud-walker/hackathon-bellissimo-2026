"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { addTodo } from "@/app/actions";
import { css } from "../../styled-system/css";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!API);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) return;

    const recognition = new API();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "";

    let finalTranscript = text;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + result[0].transcript.trim();
        } else {
          interim += result[0].transcript;
        }
      }
      setText(finalTranscript + (interim ? (finalTranscript ? " " : "") + interim : ""));
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [text, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  async function handleSubmit(formData: FormData) {
    await addTodo(formData);
    stopListening();
    setText("");
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className={css({ display: "flex", flexDir: "column", gap: "2" })}>
      <div className={css({ position: "relative" })}>
        <textarea
          name="content"
          placeholder="What needs to be done?"
          rows={4}
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={css({
            width: "100%",
            resize: "vertical",
            p: "3",
            pr: speechSupported ? "12" : "3",
            borderRadius: "md",
            border: "1px solid",
            borderColor: isListening ? "red.400" : "gray.300",
            fontSize: "md",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
            _focus: {
              borderColor: isListening ? "red.500" : "blue.500",
              boxShadow: isListening
                ? "0 0 0 2px token(colors.red.200)"
                : "0 0 0 2px token(colors.blue.200)",
            },
          })}
        />
        {speechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop recording" : "Start voice input"}
            className={css({
              position: "absolute",
              top: "2",
              right: "2",
              width: "8",
              height: "8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "full",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.1s",
              bg: isListening ? "red.500" : "gray.100",
              color: isListening ? "white" : "gray.600",
              _hover: { bg: isListening ? "red.600" : "gray.200", transform: "scale(1.05)" },
            })}
          >
            {isListening ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v7a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 9a7 7 0 0 0 14 0h2a9 9 0 0 1-8 8.94V23h-2v-2.06A9 9 0 0 1 3 12h2z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {isListening && (
        <p className={css({ fontSize: "xs", color: "red.500", display: "flex", alignItems: "center", gap: "1" })}>
          <span className={css({
            display: "inline-block",
            width: "2",
            height: "2",
            borderRadius: "full",
            bg: "red.500",
            animation: "pulse 1s infinite",
          })} />
          Listening… speak your task
        </p>
      )}

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
