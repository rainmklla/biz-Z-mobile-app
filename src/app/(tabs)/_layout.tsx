import React from 'react';
import { Keyboard } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AccountGate } from '../../../App';
import { Brand } from '../../ui/BizUI';
import { colors } from '../../ui/theme';

export default function TabLayout() {
  return (
    <AccountGate>
      <Tabs
        backBehavior="initialRoute"
        screenListeners={{
          tabPress: () => Keyboard.dismiss(),
        }}
        screenOptions={{
          headerTitle: () => <Brand />,
          headerTitleStyle: {
            color: '#18382c',
            fontSize: 17,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          tabBarActiveTintColor: colors.ink,
          tabBarInactiveTintColor: '#77857d',
          tabBarActiveBackgroundColor: colors.cream,
          tabBarLabelPosition: 'below-icon',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#dce5df',
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'My journey',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="ideas"
          options={{
            title: 'Ideas',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'bulb' : 'bulb-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tabs.Screen name="plan" options={{ title: 'My plan', tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} /> }} />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </AccountGate>
  );
}
