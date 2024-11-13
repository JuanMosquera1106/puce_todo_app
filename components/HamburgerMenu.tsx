import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import Guide from './Guide'; // Importa el componente de guía

interface HamburgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const screenWidth = Dimensions.get('window').width;

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isVisible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.7)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const [showGuide, setShowGuide] = useState(false); // Estado para mostrar u ocultar la guía

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : -screenWidth * 0.7,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: isVisible ? screenWidth * 0.7 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  const handleHelpPress = () => {
    setShowGuide(true); // Muestra el componente Guide
    onClose(); // Cierra el menú de hamburguesa
  };

  const handleGuideDone = () => {
    setShowGuide(false); // Oculta el componente Guide cuando se completa
  };

  return (
    <View style={styles.container}>
      {/* Menu overlay to detect clicks outside the menu */}
      {isVisible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
      )}

      {/* Sliding menu */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Menu Options */}
          <TouchableOpacity style={styles.menuOption} onPress={() => alert('Inicio seleccionado')}>
            <MaterialIcons name="topic" size={24} color="#ff6f00" />
            <Text style={styles.optionText}>Programación I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuOption} onPress={() => alert('Configuraciones seleccionadas')}>
            <MaterialIcons name="topic" size={24} color="#ff6f00" />
            <Text style={styles.optionText}>Cálculo I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuOption} onPress={() => alert('Acerca de seleccionado')}>
            <MaterialIcons name="topic" size={24} color="#ff6f00" />
            <Text style={styles.optionText}>Geometría I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuOption} onPress={() => alert('Agregar Materia seleccionado')}>
            <Entypo name="add-to-list" size={24} color="#ff6f00" />
            <Text style={styles.optionText}>Agregar Materia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuOption} onPress={handleHelpPress}>
            <Entypo name="help-with-circle" size={24} color="#ff6f00" />
            <Text style={styles.optionText}>Ayuda</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main content displaced with menu */}
      <Animated.View style={[styles.content, { transform: [{ translateX: contentAnim }] }]}>
        {children}
      </Animated.View>

      {/* Guide Modal */}
      <Modal visible={showGuide} animationType="slide" transparent={true}>
        <View style={styles.guideOverlay}>
          <Guide onDone={handleGuideDone} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.7,
    backgroundColor: '#1a237e', // Dark blue background
    zIndex: 2,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  menuContent: {
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#283593', // Slightly lighter blue
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    zIndex: 0,
  },
  guideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo oscuro semi-transparente para enfoque
    justifyContent: 'center',
  },
});

export default HamburgerMenu;
