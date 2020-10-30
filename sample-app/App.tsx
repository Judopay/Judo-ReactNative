// @flow
import React from 'react'
import { TouchableHighlight, Text, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './screens/Home/Home'
import Settings from './screens/Settings/Settings'
import Receipt from './screens/Receipt/Receipt'
import TokenPayments from './screens/TokenPayments/TokenPayments'
import PayByBankApp from './screens/PayByBankApp/PayByBankApp'
import TransactionDetails from "./screens/TransactionDetails/TransactionDetails";

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sample App"
          component={Home}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#5623e4',
            },
            headerTintColor: '#fff',
            headerRight: () => (
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 10 }}
              >
                  <Image
                      style={{
                          width: 30,
                          height: 30,
                          alignItems: 'center',
                          padding: 10,
                      }}
                      source={require('./resources/ic_settings.png')}
                  />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={() => ({
            headerStyle: {
              backgroundColor: '#5623e4',
            },
            headerTintColor: '#fff',
          })}
        />
        <Stack.Screen
          name="Receipt"
          component={Receipt}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#5623e4',
            },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => navigation.popToTop()}
                style={{ marginLeft: 10, marginRight: 20 }}
              >
                <Text
                  style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                >
                  Home
                </Text>
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="PayByBankApp"
          component={PayByBankApp}
          options={() => ({
            headerStyle: {
              backgroundColor: '#5623e4',
            },
            headerTintColor: '#fff',
          })}
        />
        <Stack.Screen
          name="Token Payments"
          component={TokenPayments}
          options={() => ({
            headerStyle: {
              backgroundColor: '#5623e4',
            },
            headerTintColor: '#fff',
          })}
        />
          <Stack.Screen
              name="Transaction Details"
              component={TransactionDetails}
              options={() => ({
                  headerStyle: {
                      backgroundColor: '#5623e4',
                  },
                  headerTintColor: '#fff',
              })}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
