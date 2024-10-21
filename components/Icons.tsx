import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Componente para el icono CircleInfo con FontAwesome6
export const CircleInfoIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome6
    name="circle-info"
    size={props.size || 24}
    color={props.color || "white"}
    {...props}
  />
);

// Componente para el icono Home con FontAwesome
export const HomeIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome
    name="home"
    size={props.size || 32}
    color={props.color || "white"}
    {...props}
  />
);

// Componente para el icono Info con FontAwesome
export const InfoIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome
    name="info"
    size={props.size || 32}
    color={props.color || "white"}
    {...props}
  />
);

// Componente para el icono Info con FontAwesome
export const AddIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome6 name="add" size={32} color="black" />
);

// Componente para el icono Info con FontAwesome
export const EditIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome6 name="edit" size={24} color="blue" />
);

// Componente para el icono Info con FontAwesome
export const DeleteIcon = (props: { size?: number; color?: string }) => (
  <MaterialIcons name="delete" size={30} color="red" />
);

// Componente para el icono Info con FontAwesome
export const PriorityIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome name="flag" size={24} color="black" />
);

// Componente para el icono Info con FontAwesome
export const CalendarIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome name="calendar" size={24} color="black" />
);

// Componente para el icono Info con FontAwesome
export const RepeatIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome6 name="repeat" size={24} color="black" />
);

// Componente para el icono Info con FontAwesome
export const TimeIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome6 name="clock" size={24} color="black" />
);

// Componente para el icono Info con FontAwesome
export const RememberIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome name="bell" size={24} color="black" />
);

// Componente para el icono Info con FontAwesome
export const CloseIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome name="close" size={24} color="black" />
);

// Componente para el icono Play con FontAwesome6 (Nuevo)
export const PlayIcon = (props: { size?: number; color?: string }) => (
  <FontAwesome6 name="play" size={props.size || 24} color={props.color || "green"} />
);