import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAI } from '../../hooks/useAI';

export default function SettingsScreen() {
  const { isModelReady, modelInfo } = useAI();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Model Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[styles.infoValue, { color: isModelReady ? '#4ade80' : '#ef4444' }]}>
            {isModelReady ? 'Ready' : 'Loading'}
          </Text>
        </View>
        {modelInfo && (
          <>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Model:</Text>
              <Text style={styles.infoValue}>{modelInfo.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Size:</Text>
              <Text style={styles.infoValue}>{modelInfo.size}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Offline Mode</Text>
            <Text style={styles.settingDescription}>Process all requests locally</Text>
          </View>
          <Switch
            value={true}
            disabled
            trackColor={{ false: '#333', true: '#60a5fa' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: '#999',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});