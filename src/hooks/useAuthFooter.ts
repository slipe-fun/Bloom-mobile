import { quickSpring } from '@constants/easings'
import { useNavigationState } from '@react-navigation/native'
import useAuthStore from '@stores/auth'
import useStorageStore from '@stores/storage'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const { email, emailValid, otp, username, password, setError, error, setExists } = useAuthStore()
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
  let _timeout: ReturnType<typeof setTimeout>

  const handlePress = useCallback(async () => {
    try {
      setLoading(true)
      clearTimeout(_timeout)
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
          _timeout = setTimeout(() => setError(null), ERROR_TIMOUT)
          return
        }
        mmkv.set('token', data.token)
        mmkv.set('user_id', String(data.user?.id))
        mmkv.set('user', JSON.stringify(data.user))
        router.navigate('/(auth)/signup/Password')
        return
      }

      if (index === 3) {
        const token = mmkv.getString('token')!
        await authApi.handleUsernameAndPasswordStep(token, username, password, mmkv)
        setLoading(false)
        router.navigate('/(app)/(tabs)')
      }
    } catch (e: any) {
      setLoading(false)
      setError(e?.response?.data || e?.message || 'Something went wrong')

      _timeout = setTimeout(() => setError(null), ERROR_TIMOUT)
    }
  }, [index, email, otp, username, password, router, setError, mmkv, loading, setLoading])

  useEffect(() => {
    progress.value = withSpring(progressValue, quickSpring)
  }, [progressValue])

  return { index, label, isDisabled, progress, loading, handlePress }
}
