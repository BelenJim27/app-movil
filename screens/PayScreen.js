import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StripeProvider, CardField } from '@stripe/stripe-react-native';

const PayScreen = () => {
  return (
    <StripeProvider publishableKey="pk_test_51RVT7WPt8YfLrb17pAT5PbSGpVzy0wQz8BdCWO5CUE1BAFNvB92uBlmTjxZTWsn9MnxRbiIkVzRefyyso0BdiqSO00qfabh95N">
      <View style={styles.container}>
        <CardField
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
        />
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});

export default PayScreen;
