import { quickSpring } from '@constants/easings'
import * as LocalAuthentication from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { type SharedValue, useSharedValue, withSpring } from 'react-native-reanimated'

interface UseAuthFooter {
  handleFaceIdAuth: () => void
  progress: SharedValue<number>
}

export default function useAuthFooter(): UseAuthFooter {
  const router = useRouter()
  const progress = useSharedValue(0)
  // 0 - Default
  // 1 - Failure (FaceID not recognized or error)

  const handleFaceIdAuth = async () => {
    try {
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
        promptMessage: 'Войдите с помощью FaceID', // Текст в окошке
        fallbackLabel: 'Ввести пароль', // Кнопка отмены/пароля
        disableDeviceFallback: false, // Разрешить ли пин-код телефона, если лицо не узнано
      })

      if (result.success) {
        router.navigate('/(auth)/Success')
        progress.set(withSpring(0, quickSpring))
      } else {
        Alert.alert('Отмена', 'Проверка не пройдена')
        progress.set(withSpring(1, quickSpring))
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Ошибка', 'Что-то пошло не так при вызове FaceID')
      progress.set(withSpring(1, quickSpring))
    }
  }

  return { handleFaceIdAuth, progress }
}
