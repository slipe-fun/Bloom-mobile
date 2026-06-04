import { API_URL } from '@constants/api'
import { quickSpring } from '@constants/easings'
import { getE2EEKey, saveE2EEKey } from '@lib/icloud_keychain_storage'
import { bytesToBase64 } from '@lib/skid-v3/src/utils'
import useStorageStore from '@stores/storage'
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

  const { mmkv, ensureMMKV } = useStorageStore()

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
          const loginData = await getE2EEKey()

          if (loginData) {
            console.log(loginData)
            return
          } else {
            const { default: getSKID } = await import('@lib/skid-v3')
            const skid = getSKID()

            const identity_keys = skid.keys.identity.generate()
            const master_key = skid.keys.master_key.generate()
            const recovery_key = skid.keys.recovery_key.generate()

            const encrypted_identity_keys = skid.keys.identity.encrypt(identity_keys, master_key, identity_keys.ed.secret_key)
            const encrypted_master_key = skid.keys.master_key.encrypt(master_key, recovery_key, identity_keys.ed.secret_key)

            const identity_keys_base64 = bytesToBase64(identity_keys)
            const master_key_base64 = bytesToBase64(master_key)
            const recovery_key_base64 = bytesToBase64(recovery_key)

            const storage = mmkv ?? (await ensureMMKV())

            storage.set('identity_keys', JSON.stringify(identity_keys_base64))
            storage.set('master_key', JSON.stringify(master_key_base64))
            storage.set('recovery_key', JSON.stringify(recovery_key_base64))

            const encryptedIdentityKeysBase64 = bytesToBase64(encrypted_identity_keys)
            const encryptedMasterKeyBase64 = bytesToBase64(encrypted_master_key)
            const publicKeysBase64 = bytesToBase64({
              ml_kem_public_key: identity_keys.ml_kem.public_key,
              ecdh_public_key: identity_keys.ecdh.public_key,
              ed_public_key: identity_keys.ed.public_key,
            })

            const body = {
              identity_keys: {
                encrypted_secret_keys: encryptedIdentityKeysBase64,
                public_keys: publicKeysBase64,
              },

              encrypted_master_key: encryptedMasterKeyBase64,
            }

            const response = await fetch(`${API_URL}/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            })

            if (!response.ok) {
              console.log(await response.text())
              return
            }

            const result = await response.json()

            if (result?.user) {
              storage.set('token', result?.token)
              storage.set('session', JSON.stringify(result?.session))
              await saveE2EEKey(result?.user?.id, recovery_key_base64)
            } else {
              return
            }
          }

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
