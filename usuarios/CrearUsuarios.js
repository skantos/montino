import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, getAuth, createUserWithEmailAndPassword, updateProfile } from "../database/firebase";

const CrearUsuarios = () => {
const [nombre, setNombre] = useState('');
const [contrasena, setContrasena] = useState('');
const [verificarContrasena, setVerificarContrasena] = useState('');
const navigation = useNavigation();
const [error, setError] = useState('');

const handleCrearUsuario = async () => {
    try {
    // Verifica que las contraseñas coincidan
    if (contrasena !== verificarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
    }

    // Crea el usuario con correo y contraseña utilizando Firebase Auth
    const authInstance = getAuth(appFirebase);
    const userCredential = await createUserWithEmailAndPassword(authInstance, nombre, contrasena);

    // Actualiza el perfil del usuario con el nombre
    await updateProfile(userCredential.user, { displayName: nombre });

    navigation.navigate('Lista');
    } catch (error) {
    setError('Error al crear el usuario: ' + error.message);
    }
};

return (
    <View style={styles.container}>
    <Text style={styles.label}>Nombre de Usuario:</Text>
    <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={(text) => setNombre(text)}
    />

    <Text style={styles.label}>Contraseña:</Text>
    <TextInput
        style={styles.input}
        value={contrasena}
        onChangeText={(text) => setContrasena(text)}
        secureTextEntry
    />

    <Text style={styles.label}>Verificar Contraseña:</Text>
    <TextInput
        style={styles.input}
        value={verificarContrasena}
        onChangeText={(text) => setVerificarContrasena(text)}
        secureTextEntry
    />

    {error !== '' && <Text style={styles.error}>{error}</Text>}

    <Button title="Crear Usuario" onPress={handleCrearUsuario} />
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
},
error: {
    color: 'red',
    marginBottom: 10,
},
});

export default CrearUsuarios;
