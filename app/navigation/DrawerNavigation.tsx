import React, { useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { useCalendar } from "../../context/CalendarContext";
import { useTareas } from "../../context/TareasContext";
import { MateriaModal } from "../../components/MateriaModal";
import Guide from "../../components/Guide";
import { Modal } from "react-native";


const DrawerNavigation: React.FC<any> = (props) => {
  const { materiasGlobales, editarMateria, eliminarMateria } = useCalendar();
  const { setFiltroMateria } = useTareas(); // Para filtrar tareas por materia
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [guiaVisible, setGuiaVisible] = useState(false); // Estado para mostrar el modal de Guide

  const handleEditar = (materiaId: string) => {
    setMateriaSeleccionada(materiaId);
    setModalVisible(true);
    setHasUnsavedChanges(false);
    setMenuVisibleId(null);
  };


  const handleEliminar = (materiaId: string) => {
    eliminarMateria(materiaId); // Usar la función eliminarMateria del contexto
    setMenuVisibleId(null);
  };
  
  const handleAgregarMateria = () => {
    setMateriaSeleccionada(null);
    setModalVisible(true);
    setHasUnsavedChanges(false);
  };

  const handleCloseModal = (isSaved: boolean, updatedMateria?: any) => {
    if (!isSaved && hasUnsavedChanges) {
      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Deseas salir sin guardar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir sin guardar",
            onPress: () => {
              setModalVisible(false);
              setMateriaSeleccionada(null);
              setHasUnsavedChanges(false);
            },
            style: "destructive",
          },
        ]
      );
    } else {
      setModalVisible(false);
      setMateriaSeleccionada(null);
      if (isSaved && updatedMateria && materiaSeleccionada) {
        editarMateria(materiaSeleccionada, updatedMateria); // Cambiado: usar la función editarMateria
        ToastAndroid.show("Materia editada correctamente", ToastAndroid.SHORT);
      }
    }
  };

  const handleSeleccionarMateria = (materiaId: string | null) => {
    setFiltroMateria(materiaId); // Actualiza el filtro global
    setMateriaSeleccionada(materiaId); // Marca la materia seleccionada
    props.navigation.closeDrawer(); // Cierra el Drawer
  };

  return (
    <View style={styles.container}>
      {/* Encabezado del Drawer */}
      <View style={styles.header}>
        <Icon name="menu-book" size={28} color="#fff" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.appTitle}>Panel de Materias</Text>
          <Text style={styles.subTitle}>Organiza tus actividades</Text>
        </View>
      </View>

      {/* Contenido del Drawer Scrollable */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScrollContainer}
      >
        <Text style={styles.sectionTitle}>Tus Materias</Text>

        {/* Opción "General" para mostrar todas las tareas */}
        <TouchableOpacity
          style={[
            styles.drawerItem,
            materiaSeleccionada === null && styles.selectedMateria,
          ]}
          onPress={() => handleSeleccionarMateria(null)}
        >
          <Icon name="all-inclusive" size={20} color="#555" style={styles.drawerIcon} />
          <Text style={styles.drawerText}>General</Text>
        </TouchableOpacity>

        {/* Listado de materias */}
        {materiasGlobales.map((materia) => (
          <View key={materia.id}>
            <Menu
              opened={menuVisibleId === materia.id}
              onBackdropPress={() => setMenuVisibleId(null)}
            >
              <MenuTrigger>
                <TouchableOpacity
                  style={[
                    styles.drawerItem,
                    menuVisibleId === materia.id && styles.selectedItem,
                    materiaSeleccionada === materia.id && styles.selectedMateria,
                  ]}
                  onLongPress={() => setMenuVisibleId(materia.id)}
                  onPress={() => handleSeleccionarMateria(materia.id)}
                >
                  <Icon name="book" size={20} color={materia.color} style={styles.drawerIcon} />
                  <Text style={[styles.drawerText, { color: materia.color }]}>
                    {materia.event}
                  </Text>
                </TouchableOpacity>
              </MenuTrigger>

              <MenuOptions customStyles={optionsStyles}>
                <MenuOption
                  onSelect={() => handleEditar(materia.id)}
                  customStyles={optionStyles}
                >
                  <Text style={styles.menuOptionText}>
                    <Icon name="edit" size={16} color="#28a745" /> Editar
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => handleEliminar(materia.id)}
                  customStyles={deleteOptionStyles}
                >
                  <Text style={[styles.menuOptionText, { color: "#dc3545" }]}>
                    <Icon name="delete" size={16} color="#dc3545" /> Eliminar
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ))}

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => setGuiaVisible(true)} // Abre el modal
        >
          <Icon name="help" size={20} color="#555" style={styles.drawerIcon} />
          <Text style={styles.drawerText}>Guía Rápida</Text>
        </TouchableOpacity>


        {/* Modal para mostrar Guide */}
          <Guide visible={guiaVisible} onClose={() => setGuiaVisible(false)} />
        
          {/* Nueva opción para la lista de tareas */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate("Main Tabs", { screen: "HomeStack", params: { screen: "ListaTareasSimple" } })} // Navega al TabNavigator, luego al HomeStack, y finalmente a ListaTareas
          >
            <Icon name="checklist" size={20} color="#555" style={styles.drawerIcon} />
            <Text style={styles.drawerText}>Lista de Tareas</Text>
          </TouchableOpacity>

      </DrawerContentScrollView>

      {/* Botón Flotante para Agregar Materias */}
      {/* <TouchableOpacity style={styles.addButton} onPress={handleAgregarMateria}>
        <MaterialIcons name="add-box" size={24} color="white" />
        <Text style={styles.addButtonText}>Nueva Materia</Text>
      </TouchableOpacity> */}

      {/* Modal para Materias */}
      {modalVisible && (
        <MateriaModal
          visible={modalVisible}
          onClose={() => handleCloseModal(false)}
          onSave={() => handleCloseModal(true)}
          materia={materiasGlobales.find((mat) => mat.id === materiaSeleccionada)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0891b2",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  subTitle: {
    fontSize: 14,
    color: "#d4d9e2",
    marginTop: 4,
  },
  drawerScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0891b2",
    marginVertical: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: "#e6f7ff",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  selectedMateria: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#b3e5fc",
  },
  drawerIcon: {
    marginRight: 10,
  },
  drawerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  menuOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0891b2",
    paddingVertical: 14,
    borderRadius: 30,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

const optionsStyles = {
  optionsContainer: {
    marginTop: 15,
    marginLeft: 140,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 30,
  },
};

const optionStyles = {
  optionWrapper: {
    paddingVertical: 10,
  },
};

const deleteOptionStyles = {
  optionWrapper: {
    paddingVertical: 10,
  },
};

export default DrawerNavigation;