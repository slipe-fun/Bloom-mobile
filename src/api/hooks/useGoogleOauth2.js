import googleOauth2ExchangeCode from '@api/lib/auth/googleOauth2ExchangeCode'
import { getAuthUrl, REDIRECT_URL_WITH_SCHEME } from '@constants/googleOauth2Params'
import useStorageStore from '@stores/storage'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'

export default function () {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { mmkv } = useStorageStore()
  const { counter, setCounter } = useTokenTriggerStore()

  async function startGoogleAuth() {
    setError('')
    setLoading(true)

    const authUrl = getAuthUrl()

    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URL_WITH_SCHEME)

      if (result.type !== 'success' || !result.url) {
        setError('Authorization cancelled')
        return
      }

      const parsed = Linking.parse(result.url)
      const code = parsed.queryParams?.code

      if (!code || typeof code !== 'string') {
        setError('Failed to get authorization code')
        return
      }

      const exchangeCode = await googleOauth2ExchangeCode(code)

      if (!exchangeCode?.token) {
        setError('Failed to exchange code')
        return
      }

      try {
        mmkv.set('token', exchangeCode.token)
        mmkv.set('user_id', String(exchangeCode.user?.id))
        mmkv.set('user', JSON.stringify(exchangeCode.user))
        setResult(exchangeCode)
        setCounter(counter + 1)
      } catch {
        setError('Failed to save session data')
      }
    } catch {
      setError('Google authorization failed')
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, startGoogleAuth }
}
