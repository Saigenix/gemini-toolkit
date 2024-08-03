import React from "react";
import { Handle } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore } from "utils/store";

const selector = (store) => ({
  isRunning: store.isRunning,
  toggleAudio: store.toggleAudio,
});

export default function Out({ id, data }) {
  const { isRunning, toggleAudio } = useStore(selector, shallow);

  return (
    <div className={"rounded-md bg-white shadow-xl px-1 py-1"}>
      <Handle className={"w-2 h-2"} type="target" position="top" />
      <p className="rounded-md px-2 py-2 bg-purple-500 text-sm">Gemini Output</p>
      <Handle className={"w-2 h-2"} type="source" position="bottom" />
    </div>
  );
}
