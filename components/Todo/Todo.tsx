import React from "react";
import { Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ITodo } from "@/types/type";

interface ITodoProps {
  data: ITodo;
  onToggle: (id: string, completed: boolean) => void;
}

const ToDo = (props: ITodoProps) => {
  const { data, onToggle } = props;

  return (
    <View
      className={`w-full rounded-lg mb-2 p-3 flex flex-row items-center`}
      // style={{ backgroundColor: data.color }} set to nice pastelle green when finished, or make user set favorite color in profile, when completed todo the background changes to said color(pastelle always)
    >
      <BouncyCheckbox
        fillColor="#feba17" //profile color or app theme's (#feba17)
        unFillColor="#FFFFFF"
        isChecked={data.completed}
        onPress={(isChecked: boolean) => onToggle(data.id, isChecked)}
        style={{ width: 40, height: 40 }}
      />
      <Text className="text-black ml-3 flex-1 font-JakartaSemiBold">
        {data.text}
      </Text>
    </View>
  );
};

export default ToDo;
