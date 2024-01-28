import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TextInput } from "react-native";
import { db, collection, getDocs, query, where } from "../database/firebase";
import { useNavigation } from "@react-navigation/native";

const Lista = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const productosCollection = collection(db, "productos");
        let queryProductos = productosCollection;

        // Construye la consulta con las condiciones si existen
        if (filtroNombre || filtroCategoria) {
          const condiciones = [];

          if (filtroNombre) {
            // Utiliza expresiones regulares para buscar coincidencias parciales
            condiciones.push(where("nombreProducto", ">=", filtroNombre)
              , where("nombreProducto", "<=", filtroNombre + '\uf8ff'));
          }

          if (filtroCategoria) {
            // Utiliza expresiones regulares para buscar coincidencias parciales
            condiciones.push(where("categoria", ">=", filtroCategoria)
              , where("categoria", "<=", filtroCategoria + '\uf8ff'));
          }

          queryProductos = query(queryProductos, ...condiciones);
        }

        const productosSnapshot = await getDocs(queryProductos);

        const listaProductos = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(listaProductos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      }
    };

    obtenerProductos();
  }, [filtroNombre, filtroCategoria]);

  const renderizarItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.nombreProducto}</Text>
      <Text>{item.categoria}</Text>
      <Text>{item.precio}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <Button
        title="Crear Nueva Lista"
        onPress={() => {
          navigation.navigate("Crear Lista");
        }}
      />

      <View style={styles.filtrosContainer}>
        <TextInput
          style={styles.filtroInput}
          placeholder="Nombre del producto"
          value={filtroNombre}
          onChangeText={(text) => setFiltroNombre(text)}
        />
        <TextInput
          style={styles.filtroInput}
          placeholder="Categoría"
          value={filtroCategoria}
          onChangeText={(text) => setFiltroCategoria(text)}
        />
      </View>

      <Text>Lista de Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filtroInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 8,
  },
});

export default Lista;
