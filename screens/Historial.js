import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { db } from "../dataBase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import DetallesCarrito from './DetallesProductos';

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ],
  monthNamesShort: [
    "Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.",
    "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.",
  ],
  dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

const Historial = () => {
  const navigation = useNavigation();
  const [historialCompleto, setHistorialCompleto] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [totalPorFecha, setTotalPorFecha] = useState(0);
  const [totalPorMes, setTotalPorMes] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="update"
          size={26}
          color="#1C2120"
          onPress={handleRefresh}
          style={{ marginRight: 20 }}
        />
      ),
    });
  }, [navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchHistorial();
    } catch (error) {
      console.error("Error al refrescar el historial:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  useEffect(() => {
    calcularTotalPorFecha(historialFiltrado);
  }, [historialFiltrado]);

  const fetchHistorial = async () => {
    try {
      const ventasCollection = collection(db, "sales");
      const ventasSnapshot = await getDocs(ventasCollection);
      const ventasData = ventasSnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.fechaVenta && data.fechaVenta.seconds) {
          const fechaVenta = format(new Date(data.fechaVenta.seconds * 1000), "dd/MM/yyyy");
          return {
            id: doc.id,
            ...data,
            fechaVenta: fechaVenta || "Desconocida",
            totalVenta: data.totalVenta || 0, // Asegurarse de que totalVenta no sea undefined
          };
        } else {
          console.error("Fecha de venta inválida:", data.fechaVenta);
          return null;
        }
      }).filter(item => item !== null); // Filtrar valores nulos
      setHistorialCompleto(ventasData);
      calcularTotalPorMes(ventasData);
    } catch (error) {
      console.error("Error fetching historial:", error);
    }
  };

  const calcularTotalPorFecha = (ventasData) => {
    let total = 0;
    ventasData.forEach((venta) => {
      if (venta.totalVenta) {
        total += parseFloat(venta.totalVenta) || 0;
      }
    });
    setTotalPorFecha(total);
  };

  const calcularTotalPorMes = (ventasData) => {
    const totalPorMes = {};
    ventasData.forEach((venta) => {
      const [day, month, year] = venta.fechaVenta.split("/");
      const yearMonth = `${year}-${month}`;
      if (!totalPorMes[yearMonth]) {
        totalPorMes[yearMonth] = 0;
      }
      totalPorMes[yearMonth] += parseFloat(venta.totalVenta) || 0;
    });
    setTotalPorMes(totalPorMes);
  };

  const handleDateSelect = (date) => {
    if (!date || !date.dateString) return;
    setSelectedDate(date.dateString);
    const formattedFecha = format(new Date(date.timestamp), "dd/MM/yyyy");
    filtrarHistorialPorFecha(formattedFecha);
  };

  const filtrarHistorialPorFecha = (fecha) => {
    if (!fecha || !Array.isArray(historialCompleto)) {
      console.error("Invalid fecha or historialCompleto");
      return;
    }
    const filteredHistorial = historialCompleto.filter((venta) => {
      return venta.fechaVenta === fecha;
    });
    setHistorialFiltrado(filteredHistorial);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.productos) {
          navigation.navigate("DetallesCarrito", { productos: item.productos });
        } else {
          console.error("No hay productos en el ítem", item);
        }
      }}
    >
      <View style={styles.itemContainer}>
        <Text>ID Usuario: {item.idUsuario || "Desconocido"}</Text>
        <Text>Fecha Venta: {item.fechaVenta || "Desconocida"}</Text>
        <Text>Total Venta: ${item.totalVenta || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCalendarVisible(!calendarVisible)}
        style={styles.boton}
      >
        <Text style={styles.botonText}>
          {calendarVisible ? "Ocultar Calendario" : "Mostrar Calendario"}
        </Text>
      </TouchableOpacity>
      {calendarVisible && (
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#1C2120" },
          }}
          style={styles.calendario}
          locale={"es"}
        />
      )}
      <FlatList
        data={historialFiltrado}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Día:</Text>
        <Text>
          {selectedDate}: ${totalPorFecha}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Mes:</Text>
        {Object.keys(totalPorMes).map((yearMonth) => (
          <Text key={yearMonth}>
            {yearMonth} : ${totalPorMes[yearMonth] || 0}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendario: {
    width: Dimensions.get("window").width,
    marginBottom: 12,
  },
  itemContainer: {
    width: 350,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  boton: {
    backgroundColor: "#1C2120",
    padding: 10,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
    marginVertical: 10,
  },
  botonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Historial;
