import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Select = ({ label, items, selectedValue, onValueChange, placeholder, loading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.selectContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <RNPickerSelect
            items={items}
            value={selectedValue}
            onValueChange={onValueChange}
            placeholder={placeholder ? { label: placeholder, value: null } : {}}
            style={pickerSelectStyles}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#343a40',
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 50,
  },
  loadingText: {
    color: '#6c757d',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: '#495057',
  },
  inputAndroid: {
    fontSize: 16,
    color: '#495057',
  },
  placeholder: {
    color: '#6c757d',
  },
});

export default Select;