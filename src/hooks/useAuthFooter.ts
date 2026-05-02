import { quickSpring } from '@constants/easings'
import * as LocalAuthentication from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'
import { type SharedValue, useSharedValue, withSpring } from 'react-native-reanimated'

interface UseAuthFooter {
  handleFaceIdAuth: () => void
  progress: SharedValue<number>
}

export default function useAuthFooter(): UseAuthFooter {
  const router = useRouter()
  // 0 - Default
  // 1 - Failure (FaceID not recognized or error)
  const progress = useSharedValue(0)
  // 0 - Welcome
  // 1 - Success
  const [stage, setStage] = useState(0)

  const handleFaceIdAuth = async () => {
    try {
      if (stage === 0) {
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        if (!hasHardware) {
          Alert.alert('Ошибка', 'Ваше устройство не поддерживает биометрию')
          progress.set(withSpring(1, quickSpring))
          return
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        if (!isEnrolled) {
          Alert.alert('Ошибка', 'FaceID не настроен на этом устройстве')
          progress.set(withSpring(1, quickSpring))
          return
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Log in via FaceID',
          fallbackLabel: 'Enter a password',
          disableDeviceFallback: false,
        })

        if (result.success) {
          router.navigate('/(auth)/Success')
          progress.set(withSpring(0, quickSpring))
          setStage(1)
        } else {
          Alert.alert('Отмена', 'Проверка не пройдена')
          progress.set(withSpring(1, quickSpring))
        }
      } else if (stage === 1) {
        router.replace('/(app)')
        progress.set(0)
        setStage(0)
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Ошибка', 'Что-то пошло не так при вызове FaceID')
      progress.set(withSpring(1, quickSpring))
    }
  }

  return { handleFaceIdAuth, progress }
}
