import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Animated, Text, StyleSheet, OpaqueColorValue } from "react-native";
import HomeScreen from "../(tareas)/index";
import ListaTareasSimple from "../(tareas)/tareas";
import CalendarScreen from "../calendar";
import PerformanceScreen from "../performance";
import SubjectScreen from "../subject";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          if (focused) {
            const bounceAnim = new Animated.Value(1);

            Animated.spring(bounceAnim, {
              toValue: 1.2,
              friction: 3,
              useNativeDriver: true,
            }).start();

            return (
              <Animated.View
                style={{
                  transform: [{ scale: bounceAnim }],
                  shadowColor: "#0891b2",
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                }}
              >
                {getIcon(route.name, color)}
              </Animated.View>
            );
          }

          return getIcon(route.name, color);
        },
        tabBarLabel: ({ color }) => (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color,
              marginTop: 10,
            }}
          >
            {getLabel(route.name)}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#0891b2",
        tabBarInactiveTintColor: "#737373",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Inicio" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Evita la navegación predeterminada
            navigation.reset({
              index: 0,
              routes: [{ name: "HomeStack" }], // Reinicia el stack y lleva a HomeScreen
            });
          },
        })}
      />
      <Tab.Screen name="Subject" component={SubjectScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Performance" component={PerformanceScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator para Home y ListaTareasSimple
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ListaTareasSimple" component={ListaTareasSimple} />
    </Stack.Navigator>
  );
};

// Helper para íconos
const getIcon = (name: string, color: string | OpaqueColorValue | undefined) => {
  switch (name) {
    case "HomeStack":
      return <AntDesign name="home" size={30} color={color} />;
    case "Subject":
      return <AntDesign name="book" size={30} color={color} />;
    case "Calendar":
      return <AntDesign name="calendar" size={30} color={color} />;
    case "Performance":
      return <FontAwesome name="bar-chart-o" size={30} color={color} />;
    default:
      return null;
  }
};

// Helper para etiquetas
const getLabel = (name: string) => {
  switch (name) {
    case "HomeStack":
      return "Home";
    case "Subject":
      return "Materias";
    case "Calendar":
      return "Calendario";
    case "Performance":
      return "Rendimiento";
    default:
      return "";
  }
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderRadius: 20,
    position: "absolute",
    height: 70,
    marginHorizontal: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 10,
  },
});
