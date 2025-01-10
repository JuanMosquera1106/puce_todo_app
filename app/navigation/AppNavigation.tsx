import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigation from "./DrawerNavigation"; // Contenido del Drawer
import TabNavigation from "./TabNavigation"; // Pestañas de navegación
import ListaTareasSimple from "../(tareas)/tareas";

const Drawer = createDrawerNavigator();

const AppNavigation: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNavigation {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "slide", // Mueve toda la pantalla al abrirse
        overlayColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro cuando el Drawer está abierto
        drawerStyle: {
          backgroundColor: "#fff",
          width: 310, // Anchura del Drawer
        },
        drawerActiveTintColor: "#6200ee",
        drawerInactiveTintColor: "#757575",
      }}
    >
      <Drawer.Screen name="Main Tabs" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

export default AppNavigation;
