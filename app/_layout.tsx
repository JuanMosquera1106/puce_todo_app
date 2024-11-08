import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { TareasProvider } from "../context/TareasContext";
import { CalendarProvider } from "../context/CalendarContext";
import Toast, { ToastConfigParams } from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";

// Componente personalizado para el Toast con diferentes estilos para éxito y error
const CustomToast = ({
  text1,
  text2,
  type,
}: ToastConfigParams<{}> & { type: string }) => {
  const isSuccess = type === "success";
  const icon = isSuccess ? "check" : "times"; // Ícono de "X" para error
  const backgroundColor = isSuccess ? "#2196F3" : "#FF5252"; // Azul para éxito, rojo para error

  return (
    <View style={[styles.toastContainer, { borderLeftColor: backgroundColor }]}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <FontAwesome name={icon} size={18} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
    </View>
  );
};

// Configuración del toastConfig para usar CustomToast con éxito y error
const toastConfig = {
  success: (props: ToastConfigParams<{}>) => (
    <CustomToast {...props} type="success" />
  ),
  error: (props: ToastConfigParams<{}>) => (
    <CustomToast {...props} type="error" />
  ),
};

const _layout = () => {
  return (
    <CalendarProvider>
      <TareasProvider>
        <View style={{ flex: 1 }}>
          <Tabs tabBar={(props) => <TabBar {...props} />}>
            <Tabs.Screen
              name="(tareas)/index"
              options={{ title: "Home", headerShown: false }}
            />
            <Tabs.Screen
              name="calendar"
              options={{ title: "Calendario", headerShown: false }}
            />
            <Tabs.Screen
              name="performance"
              options={{ title: "Rendimiento", headerShown: false }}
            />
          </Tabs>
          <Toast config={toastConfig} />
        </View>
      </TareasProvider>
    </CalendarProvider>
  );
};

// Estilos para CustomToast
const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    borderLeftWidth: 4,
  },
  iconContainer: {
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  text2: {
    fontSize: 15,
    color: "#666",
  },
});

export default _layout;
