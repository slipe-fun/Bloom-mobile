// import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { API_URL } from '@constants/api'
import { getAuthUrl, REDIRECT_URL_WITH_SCHEME } from '@constants/googleOauth2Params'
import useStorageStore from '@stores/storage'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import axios from 'axios'
import { useState } from 'react'

export default function () {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { mmkv } = useStorageStore()
  const { counter, setCounter } = useTokenTriggerStore()

  async function startGoogleAuth() {
    // setError('')
    // setLoading(true)
    // const authUrl = getAuthUrl();
    // try {
    //     if (await InAppBrowser.isAvailable()) {
    //         const result = await InAppBrowser.openAuth(authUrl, REDIRECT_URL_WITH_SCHEME, {});
    //         if (result.type === 'success') {
    //             const url = new URL(result.url);
    //             const code = url.searchParams.get('code');
    //             if (code) {
    //                 try {
    //                     const exchangeCode = await axios.get(`${API_URL}/oauth2/google/exchange-code?state=random-state&code=${code}`).then(res => res?.data).catch(() => null);
    //                     if (exchangeCode?.token) {
    //                         try {
    //                             mmkv.set("token", exchangeCode?.token);
    //                             mmkv.set("user_id", String(exchangeCode?.user?.id));
    //                             mmkv.set("user", JSON.stringify(exchangeCode?.user));
    //                             setResult(exchangeCode);
    //                         } catch {
    //                             setError("Failed to save session data")
    //                         }
    //                     }
    //                 } catch {
    //                     setError("Failed to exchange code")
    //                 }
    //             } else {
    //                 setError("Failed to get authorization code")
    //             }
    //         } else {
    //             setError("Failed to open in app browser")
    //         }
    //     } else {
    //         setError("In app browser is not available")
    //     }
    // } catch {
    //     setError("Google authorization failed")
    // }
    // setLoading(false);
  }

  return { result, loading, error, startGoogleAuth }
}
