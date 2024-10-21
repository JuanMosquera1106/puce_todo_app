import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { TareasProvider } from "../context/TareasContext";

const _layout = () => {
  return (
    <TareasProvider>
      <View style={{ flex: 1 }}>
        <Tabs tabBar={(props) => <TabBar {...props} />}>
          {/* Ocultar el título y el espacio superior para la pestaña "Home" */}
          <Tabs.Screen
            name="(tareas)/index"
            options={{ title: "Home", headerShown: false }}
          />
          <Tabs.Screen name="calendar" options={{ title: "Calendario" }} />
          <Tabs.Screen name="timer" options={{ title: "Cronómetro" }} />
          <Tabs.Screen name="performance" options={{ title: "Rendimiento" }} />
        </Tabs>
      </View>
    </TareasProvider>
  );
};

export default _layout;
