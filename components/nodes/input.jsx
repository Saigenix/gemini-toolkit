import React from "react";
import { Handle } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore } from "utils/store";

const selector = (id) => (store) => ({
  setGain: (e) => store.updateNode(id, { gain: +e.target.value }),
});

export default function InputF({ id, data }) {
  const { setGain } = useStore(selector(id), shallow);

  return (
    <div className={"rounded-md bg-white shadow-xl"}>
      <Handle className={"w-2 h-2"} type="target" position="top" />

      <p
        className={"rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm"}
      >
        Amp
      </p>
      <label className={"flex flex-col px-2 pt-1 pb-4"}>
        <p className={"text-xs font-bold mb-2"}>Gain</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={data.gain}
          onChange={setGain}
        />
        <p className={"text-right text-xs"}>user entered value</p>
      </label>

      <Handle className={"w-2 h-2"} type="source" position="bottom" />
    </div>
  );
}
