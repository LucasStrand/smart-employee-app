import React, { useState } from "react";
import { Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ITodo } from "@/types/type";

interface ITodoProps {
  data: ITodo;
}

const ToDo = (props: ITodoProps) => {
  const [isDone, setDone] = useState(false);

  return (
    <View
      className={`w-full rounded-lg mb-2 p-3 flex flex-row items-center`}
      style={{ backgroundColor: props.data.color }}
    >
      <BouncyCheckbox
        fillColor="#feba17"
        unFillColor="#FFFFFF"
        iconStyle={{ borderColor: "black" }}
        isChecked={isDone}
        onPress={setDone}
        style={{ width: 40, height: 40 }}
      />
      <Text className="text-black ml-3 flex-1 font-JakartaSemiBold">
        {props.data.text}
      </Text>
    </View>
  );
};

export default ToDo;
