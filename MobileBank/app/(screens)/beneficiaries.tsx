import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BeneficiariesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const beneficiaries = [
    { id: 1, name: 'Jean Dupont', iban: 'FR76 **** **** **** **29', initials: 'JD', color: '#3B9EFF' },
    { id: 2, name: 'Marie Curie', iban: 'FR76 **** **** **** **52', initials: 'MC', color: '#34C759' },
    { id: 3, name: 'Louis Pasteur', iban: 'FR76 **** **** **** **83', initials: 'LP', color: '#FF9500' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bénéficiaires</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un bénéficiaire"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {beneficiaries.map((beneficiary) => (
          <TouchableOpacity 
            key={beneficiary.id} 
            style={styles.beneficiaryItem}
          >
            <View style={styles.beneficiaryLeft}>
              <View style={[styles.avatar, { backgroundColor: beneficiary.color }]}>
                <Text style={styles.avatarText}>{beneficiary.initials}</Text>
              </View>
              <View>
                <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
                <Text style={styles.beneficiaryIban}>{beneficiary.iban}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#3B9EFF" />
          <Text style={styles.addButtonText}>Ajouter un bénéficiaire</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  beneficiaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  beneficiaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  beneficiaryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  beneficiaryIban: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#1A2942',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: '#3B9EFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
