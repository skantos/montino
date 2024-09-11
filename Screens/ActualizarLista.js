import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../dataBase/Firebase";
import { doc, updateDoc } from "firebase/firestore";

const ActualizarLista = ({ route }) => {
  const { id } = route.params.producto;
  const [nuevaCategoria, setNuevaCategoria] = useState(route.params.producto.categoriaProducto || '');
  const [nuevoNombre, setNuevoNombre] = useState(route.params.producto.nombreProducto || '');
  const [nuevoPrecio, setNuevoPrecio] = useState(`${route.params.producto.precioOriginal || ''}`);
  const [nuevoprecioProducto, setNuevoprecioProducto] = useState(`${route.params.producto.precioProducto || ''}`);
  const [nuevaCantidad, setNuevaCantidad] = useState(`${route.params.producto.cantidadProducto || ''}`);
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Producto recibido:', route.params.producto);
    setNuevaCategoria(route.params.producto.categoriaProducto || '');
    setNuevoNombre(route.params.producto.nombreProducto || '');
    setNuevoPrecio(`${route.params.producto.precioOriginal || ''}`);
    setNuevoprecioProducto(`${route.params.producto.precioProducto || ''}`);
    setNuevaCantidad(`${route.params.producto.cantidadProducto || ''}`);
  }, [route.params.producto]);

  const handleActualizarProducto = async () => {
    // Validaciones básicas
    if (!nuevoNombre || !nuevaCategoria || !nuevoPrecio || isNaN(nuevoPrecio) || !nuevoprecioProducto || isNaN(nuevoprecioProducto) || !nuevaCantidad || isNaN(nuevaCantidad)) {
      Alert.alert("Error", "Por favor, completa todos los campos correctamente.");
      return;
    }
  
    try {
      const nuevosValores = {
        categoriaProducto: nuevaCategoria,
        nombreProducto: nuevoNombre,
        precioOriginal: parseFloat(nuevoPrecio),
        precioProducto: parseFloat(nuevoprecioProducto),
        cantidadProducto: parseInt(nuevaCantidad),
      };
  
      await updateDoc(doc(db, "productos", id), nuevosValores);
  
      Alert.alert("Éxito", "Producto actualizado con éxito.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el producto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID:</Text>
      <TextInput style={styles.input} value={id} editable={false} />

      <Text style={styles.label}>Nombre del Producto:</Text>
      <TextInput
        style={styles.input}
        value={nuevoNombre}
        onChangeText={(text) => setNuevoNombre(text)}
      />

      <Text style={styles.label}>Categoría:</Text>
      <TextInput
        style={styles.input}
        value={nuevaCategoria}
        onChangeText={(text) => setNuevaCategoria(text)}
      />

      <Text style={styles.label}>Precio Detalle:</Text>
      <TextInput
        style={styles.input}
        value={nuevoPrecio}
        onChangeText={(text) => setNuevoPrecio(text)}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Precio de Venta:</Text>
      <TextInput
        style={styles.input}
        value={nuevoprecioProducto}
        onChangeText={(text) => setNuevoprecioProducto(text)}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Cantidad:</Text>
      <TextInput
        style={styles.input}
        value={nuevaCantidad}
        onChangeText={setNuevaCantidad}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleActualizarProducto} style={styles.boton}>
        <Text style={styles.botonText}>Actualizar Producto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#D4D4D4",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 8,
    paddingLeft: 10,
    color: "#333",
    borderRadius: 10,
    marginBottom: 20,
  },
  boton: {
    backgroundColor: "#1C2120",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  botonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ActualizarLista;
