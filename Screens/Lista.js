import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../dataBase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome5";

const Lista = () => {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [productoExpandido, setProductoExpandido] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Obtener productos desde Firestore y aplicar filtros
  const obtenerProductos = () => {
    setLoading(true);
    const productosCollection = collection(db, "productos");
    let queryProductos = query(productosCollection);

    if (filtro) {
      queryProductos = query(
        productosCollection,
        where("nombreProducto", ">=", filtro),
        where("nombreProducto", "<=", filtro + "\uf8ff"),
        where("categoriaProducto", ">=", filtro),
        where("categoriaProducto", "<=", filtro + "\uf8ff")
      );
    }

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(queryProductos, (snapshot) => {
      const listaProductos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(listaProductos);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener productos:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar suscripción en caso de desmontaje del componente
  };

  useEffect(() => {
    obtenerProductos();
  }, [filtro]);

  const onRefresh = async () => {
    setRefreshing(true);
    obtenerProductos(); // Refrescar productos
    setRefreshing(false);
  };

  const handleEliminarProducto = async (id) => {
    try {
      Alert.alert(
        "Confirmar",
        "¿Estás seguro de que quieres eliminar este producto?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              await deleteDoc(doc(db, "productos", id));
              // Eliminar producto del estado local
              setProductos((prevProductos) =>
                prevProductos.filter((producto) => producto.id !== id)
              );
              if (productoExpandido === id) {
                setProductoExpandido(null);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C2120" />
      </View>
    );
  }

  const handlePresionarProducto = (id) => {
    setProductoExpandido((prevProductoExpandido) =>
      prevProductoExpandido === id ? null : id
    );
  };

  const renderizarItem = ({ item }) => {
    let containerStyle = styles.itemContainer;
    if (item.cantidadProducto <= 10) {
      containerStyle = { ...containerStyle, backgroundColor: "#ffcccc" };
    } else if (item.cantidadProducto <= 20) {
      containerStyle = { ...containerStyle, backgroundColor: "#D9F2AA" };
    }

    return (
      <View style={containerStyle}>
        <TouchableOpacity onPress={() => handlePresionarProducto(item.id)}>
          <View style={styles.textoContainer}>
            <Text style={styles.nombre}>{`Nombre: ${item.nombreProducto}`}</Text>
            <Text style={styles.detalle}>{`Categoría: ${item.categoriaProducto}`}</Text>
            <Text style={styles.detalle}>{`Precio/u: ${item.precioProducto}`}</Text>
            <Text style={styles.detalle}>{`Precio/Detalle: ${item.precioOriginal}`}</Text>
            <Text style={styles.detalle}>{`Cantidad: ${item.cantidadProducto}`}</Text>
            {productoExpandido === item.id && (
              <View style={styles.botonesContainer}>
                <TouchableOpacity
                  style={styles.botonActualizar}
                  onPress={() =>
                    navigation.navigate("ActualizarLista", { producto: item })
                  }
                >
                  <Icon name="pen" size={20} color="#1C2120" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => handleEliminarProducto(item.id)}
                >
                  <Icon name="trash" size={20} color="#1C2120" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtrosContainer}>
        <View style={styles.filtroIcono}>
          <Icon name="search" size={20} color="#1C2120" />
        </View>
        <TextInput
          style={styles.filtroInput}
          placeholder="Nombre del producto o Categoría"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>
      <Text style={styles.tituloLista}>Lista de Productos</Text>
      <FlatList
        ref={scrollViewRef}
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detalle: {
    fontSize: 14,
    color: "#555",
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filtroInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 8,
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  filtroIcono: {
    justifyContent: "center",
    paddingRight: 8,
    padding: 8,
    borderColor: "gray",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
  },
  botonesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  botonActualizar: {
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 10,
    marginRight: 8,
    maxWidth: 100,
  },
  botonEliminar: {
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 10,
    maxWidth: 100,
  },
});

export default Lista;
