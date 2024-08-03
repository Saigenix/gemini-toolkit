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
      data: { text: "" },
      position: { x: -180, y: -100 },
    },
    {
      id: "input",
      type: "input",
      data: { type: "text" },
      position: { x: -200, y: 50 },
    },
    { id: "output", type: "out", position: { x: 50, y: 50 } },
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

  makeEmpty() {
    get().nodes.forEach((node) => {
      if (node.type === "prompt") {
        get().updateNode(node.id, { text: "" });
      }
    });
    // console.log(get().nodes);
  },

  reload() {
    set({ nodes: get().nodes, edges: get().edges });
  },

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  createNode(type, x, y) {
    const id = nanoid();

    switch (type) {
      case "prompt": {
        const data = { text: "" };
        const position = { x: 70, y: 120 };
        const id2 = nanoid();

        const preEdge = {
          id: nanoid(6),
          source: get().nodes[get().nodes.length - 1].id,
          target: id,
        };
        // source.connect(target);
        set({ edges: [preEdge, ...get().edges] });

        set({ nodes: [...get().nodes, { id, type, data, position }] });

        set({
          nodes: [
            ...get().nodes,
            { id: id2, type: "out", position: { x: 180, y: 250 } },
          ],
        });

        const edge = { id: nanoid(6), source: id, target: id2 };
        // source.connect(target);
        set({ edges: [edge, ...get().edges] });

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

  getData(id) {
    var value = "";
    get().nodes.map((node) => (node.id === id ? (value = node.data) : null));
    return value;
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
    console.log(data);
    const id = nanoid(6);
    const edge = { id, ...data };
    // source.connect(target);
    set({ edges: [edge, ...get().edges] });
  },

  onEdgesDelete(deleted) {
    for (const { source, target } of deleted) {
      // disconnect(source, target);
    }
  },
}));



