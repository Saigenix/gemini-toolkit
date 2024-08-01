import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { nanoid } from "nanoid";
import { create } from "zustand";
import {
  isRunning,
  toggleAudio,
  createAudioNode,
  updateAudioNode,
  removeAudioNode,
  connect,
  disconnect,
} from "utils/node-tool";

export const useStore = create((set, get) => ({
  nodes: [
    {
      id: "prompt",
      type: "prompt",
      data: { text: "your prompt.."},
      position: { x: 0, y: -100 },
    },
    {
      id: "input",
      type: "input",
      data: { type: "text" },
      position: { x: -100, y: 100 },
    },
    { id: "output", type: "out", position: { x: 50, y: 250 } },
  ],
  edges: [
    { id: "prompt->input", source: "prompt", target: "input" },
    { id: "input->output", source: "input", target: "output" },
  ],
//   isRunning: isRunning(),

//   toggleAudio() {
//     toggleAudio().then(() => {
//       set({ isRunning: isRunning() });
//     });
//   },

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  createNode(type, x, y) {
    const id = nanoid();

    switch (type) {
      case "prompt": {
        const data = { text: "your prompt.." };
        const position = { x: 0, y: 0 };

        // createAudioNode(id, type, data);
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }

      case "input": {
        const data = { type: "text" };
        const position = { x: 0, y: 0 };

        // createAudioNode(id, type, data);
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }
    }
  },

  updateNode(id, data) {
    // updateAudioNode(id, data);
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: Object.assign(node.data, data) }
          : node
      ),
    });
  },

//   onNodesDelete(deleted) {
//     for (const { id } of deleted) {
//       removeAudioNode(id);
//     }
//   },

  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge = { id, ...data };

    connect(edge.source, edge.target);
    set({ edges: [edge, ...get().edges] });
  },

  onEdgesDelete(deleted) {
    for (const { source, target } of deleted) {
      disconnect(source, target);
    }
  },
}));
