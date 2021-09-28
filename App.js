import 'react-native-gesture-handler';
import React from 'react';
import type {Node} from 'react';
import {SafeAreaView, View, Text, StatusBar, StyleSheet} from 'react-native';

import {
  DefaultTheme,
  Provider as PaperProvider,
  Button,
} from 'react-native-paper';

import {NavigationContainer} from '@react-navigation/native';

import CreateCategoryScreen from './src/screens/CreateCategoryScreen';
import CreateFundScreen from './src/screens/CreateFundScreen';
import CreateTransactionScreen from './src/screens/CreateTransactionScreen';
import ReportsScreen from './src/screens/ReportsScreen';

import {createDrawerNavigator} from '@react-navigation/drawer';

import DrawerContent from './src/components/DrawerContent';

const Drawer = createDrawerNavigator();

const theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    background: '#FAFAFA',

    primary: '#006BE5',
    card: '#FAFAFA',
    text: '#000000',
    white: '#FFFFFF',

    lightGray: '#9F9F9F',
    gray: '#7B7B7B',
    darkGray: '#555a64',

    success: '#299F48',
    warning: '#ff8d00',
    danger: '#ff2424',
  },
  fonts: {
    ...DefaultTheme.fonts,
    small: 13,
    regular: 15,
    bigger: 18,
  },
};

const App: () => Node = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaView style={styles.root}>
          <StatusBar />

          <Drawer.Navigator
            initialRouteName="Reports"
            drawerContent={props => <DrawerContent {...props} />}
          >
            <Drawer.Screen
              name="Reports"
              component={ReportsScreen}
              options={{title: 'Reports'}}
            />
            <Drawer.Screen
              name="CreateTransaction"
              component={CreateTransactionScreen}
              options={{title: 'Create Transaction'}}
            />
            <Drawer.Screen
              name="CreateCategory"
              component={CreateCategoryScreen}
              options={{title: 'Create Category'}}
            />
            <Drawer.Screen
              name="CreateFund"
              component={CreateFundScreen}
              options={{title: 'Create Fund'}}
            />
          </Drawer.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
