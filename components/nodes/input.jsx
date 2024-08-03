import React from "react";
import { Handle } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore } from "utils/store";
import { FormControl, FormLabel, RadioGroup, Radio, Stack } from "@chakra-ui/react";

const selector = (id) => (store) => ({
  setType: (e) => store.updateNode(id, { type: e }),
  type: store.getData(id).type,
});

export default function InputF({ id, data }) {
  const { setType,type } = useStore(selector(id), shallow);

  return (
    <div className={"rounded-md bg-white shadow-xl w-full"}>
      <Handle className={"w-2 h-2"} type="target" position="top" />

      <p className={"rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm"}>
        Input
      </p>
      <label
        className={
          "flex flex-col items-center justify-center px-2 pt-1 pb-4 text-black"
        }
      >
        <FormControl mb={4}>
          <FormLabel pb={0} fontSize={10} mt={1}>
            Type
          </FormLabel>
          <RadioGroup onChange={setType} value={type} colorScheme="blackAlpha">
            <Stack direction="column" spacing={1}>
              <Radio size="sm" value="text" border={"1px solid black"}>
                Text
              </Radio>
              <Radio size="sm" value="img" border={"1px solid black"}>
                Image
              </Radio>
              <Radio size="sm" value="both" border={"1px solid black"}>
                Both
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <p className={"text-right text-xs text-black"}>user entered value</p>
      </label>

      <Handle className={"w-2 h-2"} type="source" position="bottom" />
    </div>
  );
}
