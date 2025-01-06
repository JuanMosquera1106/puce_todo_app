import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { View, Animated, Text, StyleSheet, OpaqueColorValue } from "react-native";
import HomeScreen from "../(tareas)/index";
import CalendarScreen from "../calendar";
import PerformanceScreen from "../performance";
import SubjectScreen from "../subject";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          // Initialize bounce animation only if focused
          if (focused) {
            const bounceAnim = new Animated.Value(1);

            Animated.spring(bounceAnim, {
              toValue: 1.2, // Scale up value for focused icon
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

          // Return static icon for non-focused tabs
          return getIcon(route.name, color);
        },
        tabBarLabel: ({ focused, color }) => (
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Subject" component={SubjectScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Performance" component={PerformanceScreen} />
    </Tab.Navigator>
  );
}

// Helper function to get icon based on route name
const getIcon = (name: string, color: string | OpaqueColorValue | undefined) => {
  switch (name) {
    case "Home":
      return <AntDesign name="home" size={30} color={color} />;
    case "Subject":
    return <AntDesign name="book" size={30} color={color} />
    case "Calendar":
      return <AntDesign name="calendar" size={30} color={color} />;
    case "Performance":
      return <FontAwesome name="bar-chart-o" size={30} color={color} />;
    default:
      return null;
  }
};

// Helper function to get label based on route name
const getLabel = (name: string) => {
  switch (name) {
    case "Home":
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
  badge: {
    backgroundColor: "#ff5722",
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    borderRadius: 10,
    minWidth: 18,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});
