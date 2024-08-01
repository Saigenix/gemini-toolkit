import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import "../app/TextUpdater.css";
const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div >
        <label htmlFor="text">Prompt</label>
        <textarea id="text" name="text" onChange={onChange} className="nodrag" placeholder="Enter Primary Prompt"/>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
