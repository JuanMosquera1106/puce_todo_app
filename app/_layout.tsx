import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { TareasProvider } from "../context/TareasContext";
import { CalendarProvider } from "../context/CalendarContext";

const _layout = () => {
  return (
    <CalendarProvider>
      <TareasProvider>
        <View style={{ flex: 1 }}>
          <Tabs tabBar={(props) => <TabBar {...props} />}>
            {/* Ocultar el título y el espacio superior para la pestaña "Home" */}
            <Tabs.Screen
              name="(tareas)/index"
              options={{ title: "Home", headerShown: false }}
            />
<<<<<<< HEAD
            <Tabs.Screen
              name="calendar"
              options={{ title: "Calendario", headerShown: false }}
            />
            <Tabs.Screen
              name="performance"
              options={{ title: "Rendimiento", headerShown: false }}
=======
            <Tabs.Screen name="calendar" options={{ title: "Calendario" }} />
            <Tabs.Screen
              name="performance"
              options={{ title: "Rendimiento" }}
>>>>>>> fc5e4fc128a70fc242b5e6c700dff94d5c8734dc
            />
          </Tabs>
        </View>
      </TareasProvider>
    </CalendarProvider>
  );
};

export default _layout;
