import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
