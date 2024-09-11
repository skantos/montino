import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetallesProductos = ({ route }) => {
  const { productos } = route.params || { productos: [] };

  if (!Array.isArray(productos) || productos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>No hay productos disponibles</Text>
      </View>
    );
  }

  const total = productos.reduce((acc, producto) => {
    console.log("Producto:", producto);
    return acc + (producto.cantidadProducto || 0) * (producto.precioProducto || 0);
  }, 0);

  const formattedTotal = total.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalles de Productos</Text>
      <View>
        {productos.map((producto, index) => (
          <View key={index} style={styles.productoContainer}>
            <Text>{`Producto: ${productos.nombreProducto || "Desconocido"}`}</Text>
            <Text>{`Cantidad: ${productos.cantidadProducto || "0"}`}</Text>
            <Text>{`Precio: $${Math.floor(productos.precioProducto || 0)}`}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.totalText}>{`Total: $${formattedTotal}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
});

export default DetallesProductos;
