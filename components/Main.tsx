import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

export const Main = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>Bienvenido a la Gestión de Tareas</Text>

      {/* Enlace a la pantalla de gestión de tareas */}
      <Link href="/(tareas)">
        <Button title="Ir a Gestión de Tareas" />
      </Link>

      {/* Enlace a la pantalla de configuración */}
      <Link href="/config">
        <Button title="Ir a Configuración" />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },
});
