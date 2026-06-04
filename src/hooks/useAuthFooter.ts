import { quickSpring } from '@constants/easings'
import { getE2EEKey, saveE2EEKey } from '@lib/icloud_keychain_storage'
import { restoreBytes } from '@lib/skid-v3/src/utils'
import useStorageStore from '@stores/storage'
import * as LocalAuthentication from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { type SharedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import { authService } from '../services/authService'

type Stage = 'welcome' | 'success'

export default function useFaceIdAuth(): { handleFaceIdAuth: () => Promise<void>; progress: SharedValue<number> } {
  const { replace, navigate } = useRouter()
  const progress = useSharedValue(0)
  const [stage, setStage] = useState<Stage>('welcome')
  const { ensureMMKV } = useStorageStore()
  const isMounted = useRef(true)

  useEffect(
    () => () => {
      isMounted.current = false
    },
    [],
  )

  const fail = useCallback(
    (title: string, msg: string) => {
      Alert.alert(title, msg)
      progress.set(withSpring(1, quickSpring))
    },
    [progress],
  )

  const handleFaceIdAuth = useCallback(async () => {
    try {
      if (stage === 'success') {
        replace('/(app)')
        if (isMounted.current) {
          progress.set(0)
          setStage('welcome')
        }
        return
      }

      if (!(await LocalAuthentication.hasHardwareAsync())) return fail('Ошибка', 'Биометрия не поддерживается')
      if (!(await LocalAuthentication.isEnrolledAsync())) return fail('Ошибка', 'FaceID не настроен')

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Log in via FaceID',
        fallbackLabel: 'Enter a password',
      })

      if (!auth.success) {
        return
      }

      const loginData = await getE2EEKey()
      const storage = await ensureMMKV()

      if (loginData) {
        const res = await authService.login(loginData.userId, restoreBytes(loginData.key))
        storage.set('token', res.token)
        storage.set('session', JSON.stringify(res.session))
        storage.set('identity_keys', JSON.stringify(res.identity_keys))
        storage.set('master_key', res.master_key)
        storage.set('recovery_key', loginData.key)
      } else {
        const res = await authService.register()
        storage.set('token', res.token)
        storage.set('session', JSON.stringify(res.session))
        storage.set('identity_keys', JSON.stringify(res.identity_keys))
        storage.set('master_key', res.master_key)
        storage.set('recovery_key', res.recovery_key)
        await saveE2EEKey(res.userId, res.recovery_key)
      }

      if (isMounted.current) {
        navigate('/(auth)/Success')
        progress.set(withSpring(0, quickSpring))
        setStage('success')
      }
    } catch (err) {
      console.error(err)
      fail('Ошибка', err instanceof Error ? err.message : 'Произошла непредвиденная ошибка')
    }
  }, [stage, replace, navigate, progress, ensureMMKV, fail])

  return { handleFaceIdAuth, progress }
}
