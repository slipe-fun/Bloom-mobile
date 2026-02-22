import { quickSpring } from '@constants/easings'
import generateKeys from '@lib/skid/generateKeys'
import { useNavigationState } from '@react-navigation/native'
import useAuthStore from '@stores/auth'
import useStorageStore from '@stores/storage'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard } from 'react-native'
import { type SharedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import { authApi } from './api/useAuthFooter.api'

interface UseAuthFooter {
  index: number
  label: string
  isDisabled: boolean
  progress: SharedValue<number>
  handlePress: () => Promise<void>
  loading?: boolean
}

export default function useAuthFooter(): UseAuthFooter {
  const router = useRouter()
  const index = useNavigationState((s) => s.index)
  const { exists, email, emailValid, otp, username, dbUsername, password, setError, setDbUsername, error, setExists } = useAuthStore()
  const { mmkv } = useStorageStore()
  const progress = useSharedValue(0)
  const [loading, setLoading] = useState(false)

  const isDisabled = useMemo(
    () =>
      (
        ({
          1: !emailValid,
          2: otp.length < 6,
          3: password.length < 6,
        }) as Record<number, boolean>
      )[index] ?? false,
    [index, emailValid, otp, password],
  )
  const progressValue = useMemo(() => {
    if (index === 0) return 0
    if (error) return 3
    const valid = (index === 1 && emailValid) || (index === 2 && otp.length >= 6) || (index === 3 && password.length >= 6)
    return valid ? 2 : 1
  }, [index, emailValid, otp, password, error])

  const label = index === 0 ? 'Продолжить с Почтой' : index === 3 ? 'Завершить' : 'Продолжить'
  const ERROR_TIMOUT = 10000
  let timeout: NodeJS.Timeout

  const handlePress = useCallback(async () => {
    try {
      setLoading(true)
      clearTimeout(timeout)
      Keyboard.dismiss()
      if (index === 0) {
        router.navigate('/(auth)/signup/Email')
        setLoading(false)
        return
      }

      if (index === 1) {
        const { exists } = await authApi.handleEmailStep(email)
        setLoading(false)
        setExists(exists)
        router.navigate('/(auth)/signup/Otp')
        return
      }

      if (index === 2) {
        const data = await authApi.handleOtpStep(email, otp)
        setLoading(false)
        if (!data?.token) {
          setError('Неверный код подтверждения. Попробуйте ещë раз')
          timeout = setTimeout(() => setError(null), ERROR_TIMOUT)
          return
        }

        const session_keys = generateKeys()

        const send_keys = await authApi.addSessionKeys(data?.token, session_keys)
        if (!send_keys) {
          setError('Не удалось сгенерировать ключи шифрования. Попробуйте ещё раз')
          timeout = setTimeout(() => setError(null), ERROR_TIMOUT)
          return
        }

        mmkv.set(
          'session',
          JSON.stringify({
            id: data?.session_id,
            ...session_keys,
          }),
        )
        mmkv.set('token', data?.token)
        mmkv.set('user_id', String(data?.user?.id))
        mmkv.set('session_id', String(data?.session_id))
        mmkv.set('user', JSON.stringify(data?.user))
        setDbUsername(data?.user?.username)
        router.navigate('/(auth)/signup/Password')
        return
      }

      if (index === 3) {
        const token = mmkv.getString('token')!
        await authApi.handleUsernameAndPasswordStep(token, dbUsername?.length > 0 && exists ? dbUsername : username, password, mmkv)
        setLoading(false)
        router.navigate('/(app)/(tabs)')
      }
    } catch (e: any) {
      setLoading(false)
      setError(e?.response?.data || e?.message || 'Something went wrong')

      timeout = setTimeout(() => setError(null), ERROR_TIMOUT)
    }
  }, [index, email, otp, username, password, router, setError, mmkv, loading, setLoading])

  useEffect(() => {
    progress.value = withSpring(progressValue, quickSpring)
  }, [progressValue])

  return { index, label, isDisabled, progress, loading, handlePress }
}
