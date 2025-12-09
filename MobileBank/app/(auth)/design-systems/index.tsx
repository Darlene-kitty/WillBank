import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * 🎨 MENU DE SÉLECTION DES DESIGN SYSTEMS
 * 
 * Permet de tester et comparer les 4 Design Systems
 */

interface DesignSystemCard {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  features: string[];
}

const designSystems: DesignSystemCard[] = [
  {
    id: 'md3',
    name: 'Material Design 3',
    description: 'Google - Design moderne et structuré',
    icon: 'logo-google',
    color: '#4285F4',
    route: '/design-systems/material-design-3',
    features: [
      'Labels flottants',
      'Élévations douces',
      'Espacements 8dp',
      'Animations Material',
    ],
  },
  {
    id: 'ios',
    name: 'iOS Human Interface',
    description: 'Apple - Design natif et fluide',
    icon: 'logo-apple',
    color: '#007AFF',
    route: '/design-systems/ios-hig',
    features: [
      'Animations spring',
      'Blur effects',
      'Touch targets 44px',
      'SF Pro Typography',
    ],
  },
  {
    id: 'ant',
    name: 'Ant Design Mobile',
    description: 'Alibaba - Composants mobiles riches',
    icon: 'phone-portrait',
    color: '#1890FF',
    route: '/design-systems/ant-mobile',
    features: [
      'Composants métier',
      'Formulaires avancés',
      'Listes optimisées',
      'Gestes tactiles',
    ],
  },
  {
    id: 'banking',
    name: 'Banking Modern',
    description: 'Revolut/N26 - Design bancaire premium',
    icon: 'card',
    color: '#0066FF',
    route: '/design-systems/banking-modern',
    features: [
      'Cartes glassmorphism',
      'Animations premium',
      'Visualisations',
      'Micro-interactions',
    ],
  },
];

export default function DesignSystemsMenu() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Design Systems
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Testez et comparez les différents styles
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>
              Mode Test
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Chaque écran de login utilise un Design System différent. 
              Testez les interactions et choisissez votre préféré !
            </Text>
          </View>
        </View>

        {/* Design Systems Cards */}
        {designSystems.map((ds, index) => (
          <Pressable
            key={ds.id}
            style={({ pressed }) => [
              styles.card,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              }
            ]}
            onPress={() => router.push(ds.route as any)}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: ds.color + '20' }]}>
                <Ionicons name={ds.icon} size={28} color={ds.color} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {ds.name}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {ds.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>

            {/* Features */}
            <View style={styles.features}>
              {ds.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: ds.color }]} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            {/* Badge */}
            <View style={[styles.badge, { backgroundColor: ds.color + '15' }]}>
              <Text style={[styles.badgeText, { color: ds.color }]}>
                Tester →
              </Text>
            </View>
          </Pressable>
        ))}

        {/* Comparison Note */}
        <View style={[styles.noteCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.noteTitle, { color: colors.text }]}>
            💡 Conseil
          </Text>
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            Testez chaque Design System en interagissant avec les champs, 
            boutons et animations. Notez celui qui correspond le mieux à 
            l'identité de WillBank.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  features: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
