import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AccountGate } from '../../../App';
import { Brand } from '../../ui/BizUI';
import { colors } from '../../ui/theme';

function TabIcon({ focused, color, size, activeIcon, inactiveIcon }: {
  focused: boolean;
  color: React.ComponentProps<typeof Ionicons>['color'];
  size: number;
  activeIcon: React.ComponentProps<typeof Ionicons>['name'];
  inactiveIcon: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-end', height: 32 }}>
      <View
        style={{
          width: 18,
          height: 2,
          borderRadius: 1,
          marginBottom: 4,
          backgroundColor: colors.yellowEdge,
          opacity: focused ? 1 : 0,
        }}
      />
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        color={color}
        size={size}
      />
    </View>
  );
}
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
          tabBarActiveBackgroundColor: 'transparent',
          tabBarLabelPosition: 'below-icon',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 1,
          },
          tabBarItemStyle: {
            marginHorizontal: 4,
            marginVertical: 6,
          },
          tabBarBackground: () => (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  borderColor: 'rgba(227, 230, 218, 0.65)',
                  borderWidth: 1,
                },
              ]}
            />
          ),
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopColor: 'transparent',
            borderTopWidth: 0,
            borderRadius: 24,
            marginHorizontal: 12,
            marginTop: 6,
            marginBottom: 8,
            paddingTop: 4,
            paddingBottom: 2,
            elevation: 8,
            shadowColor: colors.ink,
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'My journey',
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon focused={focused} color={color} size={size} activeIcon="home" inactiveIcon="home-outline" />
            ),
          }}
        />

        <Tabs.Screen
          name="ideas"
          options={{
            title: 'Ideas',
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon focused={focused} color={color} size={size} activeIcon="bulb" inactiveIcon="bulb-outline" />
            ),
          }}
        />

                <Tabs.Screen
          name="plan"
          options={{
            title: 'My plan',
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon
                focused={focused}
                color={color}
                size={size}
                activeIcon="document-text"
                inactiveIcon="document-text-outline"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon focused={focused} color={color} size={size} activeIcon="person" inactiveIcon="person-outline" />
            ),
          }}
        />
      </Tabs>
    </AccountGate>
  );
}
