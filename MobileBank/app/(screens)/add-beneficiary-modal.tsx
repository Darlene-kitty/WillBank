import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddBeneficiaryModal() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const handleAddBeneficiary = () => {
    if (!name || !accountNumber || !bankName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // TODO: Add beneficiary to storage/context
    Alert.alert('Succès', 'Bénéficiaire ajouté avec succès', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajouter un bénéficiaire</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nom du bénéficiaire"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Numéro de compte"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nom de la banque"
          value={bankName}
          onChangeText={setBankName}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddBeneficiary}>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
