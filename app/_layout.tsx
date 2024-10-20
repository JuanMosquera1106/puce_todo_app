import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'
import { TareasProvider } from '../context/TareasContext'

const _layout = () => {
  return (
   <Tabs
     tabBar={props=> <TabBar {...props} />}
     >
        <Tabs.Screen name="index"  options={{ title: 'Home' }} />
        <Tabs.Screen name="calendar"  options={{ title: 'Calendario' }} />
        <Tabs.Screen name="timer"  options={{ title: 'Cronometro' }} />
        <Tabs.Screen name="performance"  options={{ title: 'Rendimiento' }} />
   </Tabs>
  )
}

export default _layout