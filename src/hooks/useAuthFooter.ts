import { API_URL } from '@constants/api'
import { ROUTES } from '@constants/routes'
import { Buffer } from '@craftzdog/react-native-buffer'
import { decryptKeys, encryptKeys, hashPassword } from '@lib/skid/encryptKeys'
import useAuthStore from '@stores/auth'
import useStorageStore from '@stores/storage'
import axios from 'axios'
import { useCallback, useMemo } from 'react'

export default function useAuthFooter(navigation: any) {
  const { index, email, emailValid, otp, password, setError, error } = useAuthStore()
  const { mmkv } = useStorageStore()

  const isDisabled = useMemo(() => {
    if (index === 1) return !emailValid
    if (index === 2) return otp.length < 6
    if (index === 3) return password.length < 6
    return false
  }, [index, emailValid, otp, password])

  const progressValue = useMemo(() => {
    if (index === 0) return 0
    if (index === 1) return emailValid ? 2 : 1
    if (index === 2) return otp.length >= 6 ? 2 : 1
    if (index === 3) return password.length >= 6 ? 2 : 1
    if (error) return 3
    return password.length >= 8 ? 2 : 1
  }, [index, emailValid, otp, password, error])

  const label = index === 0 ? 'Продолжить с Почтой' : index === 3 ? 'Завершить' : 'Продолжить'

  const handlePress = useCallback(async () => {
    console.log('swag')
    try {
      switch (index) {
        case 0:
          navigation.navigate(ROUTES.auth.signup.email)
          break

        case 1: {
          const checkRes = await axios.get(`${API_URL}/user/exists`, { params: { email } })
          const isUserExists = checkRes.data?.exists

          if (isUserExists === undefined) throw new Error('Failed to check user')

          if (isUserExists) {
            axios.post(`${API_URL}/auth/request-code`, { email }).catch(console.error)
          } else {
            const regRes = await axios.post(`${API_URL}/auth/register`, { email })
            if (regRes.data?.error) throw new Error('Failed to register')
          }
          navigation.navigate(ROUTES.auth.signup.otp)
          break
        }

        case 2: {
          try {
            const verifyRes = await axios.post(`${API_URL}/auth/verify-code`, { email, code: otp })
            const { token, user } = verifyRes.data || {}

            console.log(verifyRes.data)

            if (token) {
              console.log(token)
              mmkv.set('token', token)
              mmkv.set('user_id', String(user?.id))
              mmkv.set('user', JSON.stringify(user))
              navigation.navigate(ROUTES.auth.signup.password)
            } else {
              setError('Неверный код подтверждения. Попробуйте ещë раз')
            }
          } catch (error) {
            console.log('swag error')
            console.log(error, JSON.stringify(error))
            console.error(error)
          }

          break
        }

        case 3: {
          const token = mmkv.getString('token')
          const privateKeys = await axios
            .get(`${API_URL}/chats/keys/private`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res?.data)
            .catch(console.error)

          if (!privateKeys) {
            const { hash, salt } = await hashPassword(password)
            const { ciphertext, nonce } = encryptKeys(hash, new TextEncoder().encode('[]'))

            await axios.post(
              `${API_URL}/chats/keys/private`,
              { ciphertext, nonce, salt: Buffer.from(salt).toString('base64') },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            mmkv.set('password', Buffer.from(hash).toString('base64'))
            mmkv.set('salt', Buffer.from(salt).toString('base64'))
          } else {
            const { hash } = await hashPassword(password, Buffer.from(privateKeys?.salt, 'base64'))

            mmkv.set('password', Buffer.from(hash).toString('base64'))
            mmkv.set('salt', privateKeys?.salt)

            try {
              const keys = decryptKeys(hash, privateKeys?.ciphertext, privateKeys?.nonce)

              const dump = keys.map((_keys) => {
                return {
                  id: _keys?.chat_id,
                  keys: {
                    my: {
                      kyberPublicKey: _keys.kyberPublicKey,
                      ecdhPublicKey: _keys.ecdhPublicKey,
                      edPublicKey: _keys.edPublicKey,
                      kyberSecretKey: _keys.kyberSecretKey,
                      ecdhSecretKey: _keys.ecdhSecretKey,
                      edSecretKey: _keys.edSecretKey,
                    },
                    recipient: {},
                  },
                }
              })

              mmkv.set('chats', JSON.stringify(dump.filter((_keys) => _keys.id)))
            } catch {
              console.log('FAILED TO DECRYPT KEYS')
            }
          }
        }
      }
    } catch (e: any) {
      setError(e.response.data || e.message || 'Something went wrong')
    }
  }, [index, email, otp, navigation, setError, mmkv, password])

  return {
    index,
    label,
    isDisabled,
    progressValue,
    handlePress,
  }
}
