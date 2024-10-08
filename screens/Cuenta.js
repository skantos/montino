import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CuentaStyles } from "../styles/CuentaEstilo";
import { db, auth } from "../dataBase/Firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

function Perfil() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const identifyUser = auth.currentUser;
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
        Alert.alert("Cuenta cerrada");
      })
      .catch((error) => Alert.alert(error.message));
  };

  if (loading) {
    return (
      <View style={CuentaStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C2120" />
        <Text style={CuentaStyles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={CuentaStyles.container}>
      <View style={CuentaStyles.header}>
        <Text style={CuentaStyles.logo}>Montino</Text>
        <View style={CuentaStyles.buttonContainer}>
          <TouchableOpacity
            style={CuentaStyles.iconButton}
            onPress={() => navigation.navigate("Editar Usuario")}
          >
            <MaterialIcons name="settings" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={CuentaStyles.iconButton}
            onPress={handleSignOut}
          >
            <MaterialIcons name="exit-to-app" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {!user ? (
        <Text>No hay datos</Text>
      ) : (
        <View style={CuentaStyles.profile}>
          <Text style={CuentaStyles.subtitle}>Perfil de Montino</Text>
          <Image
            source={require("../images/panda_recuperar.png")}
            style={CuentaStyles.logoImage}
          />
          {renderProfileInfo("user", user.nombreUsuario)}
          {renderProfileInfo("envelope-o", user.emailUsuario)}
          {renderProfileInfo("briefcase", user.rolUsuario)}
        </View>
      )}
    </View>
  );
}

const renderProfileInfo = (iconName, text) => (
  <View style={CuentaStyles.section}>
    <View style={CuentaStyles.iconTextContainer}>
      <FontAwesome name={iconName} size={19} color="#1C2120" />
      <Text style={CuentaStyles.text}>{text}</Text>
    </View>
  </View>
);

export default Perfil;
