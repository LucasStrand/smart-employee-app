import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface ITodo {
  id: string;
  completed: boolean;
  text: string;
  // color: string;
}

declare interface BackendTodo extends ITodo {
  completed: boolean; // Matches database field
}

declare interface ToDoList {
  user_id?: string;
  id: string;
  name: string;
  description: string;
  todos: BackendTodo[];
  belongs_to: string;
}
