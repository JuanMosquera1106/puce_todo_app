import React from "react";
import { Image, StyleSheet } from "react-native";

export const Logo = () => {
  return (
    <Image
      style={styles.logo}
      source={{ uri: "https://example.com/logo.png" }}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
});
