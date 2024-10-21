import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { AntDesign, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    "(tareas)/index": (props) => <AntDesign name="home" size={26} {...props} />,
    calendar: (props) => <AntDesign name="calendar" size={26} {...props} />,
    timer: (props) => <MaterialIcons name="av-timer" size={26} {...props} />,
    performance: (props) => (
      <FontAwesome name="bar-chart-o" size={26} {...props} />
    ),
  };

  const primaryColor = "#0891b2";
  const greyColor = "#737373";

  // Crear un array de Animated.Values fuera del mapeo
  const scaleValues = useRef(
    state.routes.map(() => new Animated.Value(1)),
  ).current;

  // Ejecutar animación en función del enfoque
  useEffect(() => {
    const animations = state.routes.map((_, index) => {
      return Animated.spring(scaleValues[index], {
        toValue: state.index === index ? 1.2 : 1,
        friction: 3,
        useNativeDriver: true,
      });
    });

    // Iniciar todas las animaciones
    Animated.stagger(50, animations).start();
  }, [state.index, scaleValues, state.routes]); // Incluye state.routes en las dependencias

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        // Debugging: imprimir el nombre de la ruta
        console.log("Route name:", route.name);

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Animated.View
              style={{ transform: [{ scale: scaleValues[index] }] }}
            >
              {icons[route.name]({
                color: isFocused ? primaryColor : greyColor,
              })}
            </Animated.View>
            <Text style={{ color: isFocused ? primaryColor : greyColor }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5, // Para Android
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
});

export default TabBar;
