import { Avatar } from '@components/ui'
import { useFocusEffect } from 'expo-router'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { Confetti, type ConfettiMethods } from 'react-native-fast-confetti'
import { StyleSheet } from 'react-native-unistyles'

export default function Success() {
  const confettiRef = useRef<ConfettiMethods>(null)
  const { t } = useTranslation('auth')

  useFocusEffect(
    useCallback(() => {
      confettiRef.current?.restart()
    }, []),
  )
  return (
    <View style={styles.container}>
      <Confetti ref={confettiRef} count={150} fadeOutOnEnd />
      <Avatar size="4xl" userId="123jdN$hDSb" />
      <View style={styles.textContainer}>
        <Text style={styles.welcome}>{t('auth:success.welcome')}</Text>
        <Text style={styles.name}>Dikiy dikiens</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'center',
    gap: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  name: {
    fontSize: theme.fontSize.xxxl,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
  },
  welcome: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.secondaryText,
  },
  textContainer: {
    gap: theme.spacing.xs,
    marginBottom: 120,
    alignItems: 'center',
  },
}))
