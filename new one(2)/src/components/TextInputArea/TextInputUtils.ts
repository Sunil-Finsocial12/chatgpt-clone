import React from "react";

export const resetTextAreaHeight = () => {
  const textarea = document.querySelector("textarea");
  if (textarea) {
    textarea.style.height = "56px";
  }
};

export const handleTextAreaResize = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setInputText: (text: string) => void
) => {
  const textarea = e.target;
  const value = textarea.value;

  if (!value.trim()) {
    textarea.style.height = "56px";
  } else {
    textarea.style.height = "inherit";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  setInputText(value);
};
