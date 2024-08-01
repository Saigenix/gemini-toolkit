import React from "react";
import { Handle } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore } from "utils/store";

const selector = (id) => (store) => ({
  setText: (e) => store.updateNode(id, { text: e.target.value }),
});

export default function Prompt({ id, data }) {
  const { setText } = useStore(selector(id), shallow);

  return (
    <div className="rounded-md bg-white shadow-xl p-1">
      <p className="rounded-t-md px-2 py-2 bg-pink-500 text-sm">Prompt</p>
      <textarea
        className="bg-white border text-black border-black m-1 w-80 p-1"
        type="textarea"
        value={data.text}
        onChange={setText}
        placeholder="Enter Primary Prompt"
      />
      <hr className="border-gray-200 mx-2" />
      <Handle className="w-2 h-2" type="source" position="bottom" />
    </div>
  );
}
