// components/HeaderSearchInput.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HeaderSearchInput() {
  const navigation = useNavigation();
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      navigation.navigate('Busqueda', { query });
      setQuery('');
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#666" />
      <TextInput
        style={styles.input}
        placeholder="Buscar en la tienda"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Ionicons name="arrow-forward-circle" size={22} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  input: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
  },
});