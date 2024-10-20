import React from "react";
import 'react-native-gesture-handler'; 
import { TareasProvider } from "./context/TareasContext";
import { Slot } from 'expo-router'; // Esto manejará las rutas

export default function App() {
  return (
    <Slot /> 
  );
}
