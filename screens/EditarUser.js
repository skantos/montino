import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth } from "../dataBase/Firebase";
import { updatePassword } from "firebase/auth";
import { EditarUserStyles } from "../styles/EditarUserEstilo";

const EditarUser = () => {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const identifyUser = auth.currentUser;

    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        const userData = snapshot.data();
        setUserData(userData);
        setNewName(userData.nombreUsuario || "");
        setNewPassword(""); // No preestablecer la contraseña, dejar campo vacío
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  const actualizarDatosUsuario = async () => {
    try {
      const identifyUser = auth.currentUser;

      if (identifyUser) {
        const userDocRef = doc(db, "users", identifyUser.uid);

        const updatedUserData = {
          nombreUsuario: newName || userData.nombreUsuario,
          emailUsuario: userData.emailUsuario // No permitas que el email sea modificado
        };

        await setDoc(userDocRef, updatedUserData, { merge: true });

        if (newPassword) {
          await updatePassword(identifyUser, newPassword);
          console.log("Contraseña actualizada con éxito");
        }

        console.log("Datos del usuario actualizados con éxito");
        Alert.alert("Datos del usuario actualizados con éxito");
      }
    } catch (error) {
      console.error("Error al actualizar datos del usuario:", error);
      Alert.alert("Error al actualizar datos del usuario", error.message);
    }
  };

  if (loading) {
    return (
      <View style={EditarUserStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={EditarUserStyles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={EditarUserStyles.scrollView}>
      <View style={EditarUserStyles.container}>
        <Text style={EditarUserStyles.textTitle}>Editar Usuario</Text>
        <Image
          source={require("../images/editar.png")}
          style={EditarUserStyles.logoImage}
        />
        <Text style={EditarUserStyles.text}>Nombre</Text>
        <TextInput
          style={EditarUserStyles.input}
          placeholder="Nombre"
          value={newName}
          onChangeText={(text) => setNewName(text)}
        />
        <Text style={EditarUserStyles.text}>Contraseña</Text>
        <TextInput
          style={EditarUserStyles.input}
          placeholder="Contraseña"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          secureTextEntry // Para ocultar la contraseña
        />
        <TouchableOpacity
          onPress={actualizarDatosUsuario}
          style={EditarUserStyles.boton}
        >
          <Text style={EditarUserStyles.botonText}>Actualizar Datos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarUser;
