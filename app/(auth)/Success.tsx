import { useFocusEffect } from 'expo-router'
import { useCallback, useRef } from 'react'
import { View } from 'react-native'
import { Confetti, type ConfettiMethods } from 'react-native-fast-confetti'
import { StyleSheet } from 'react-native-unistyles'

export default function Success() {
  const confettiRef = useRef<ConfettiMethods>(null)

  useFocusEffect(
    useCallback(() => {
      confettiRef.current?.restart()
    }, []),
  )
  return (
    <View style={styles.container}>
      <Confetti ref={confettiRef} count={150} fadeOutOnEnd />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.background,
  },
}))
