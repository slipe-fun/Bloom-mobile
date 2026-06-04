import * as Keychain from 'react-native-keychain'

const SERVICE_ID = 'pw.bloom.app.icloud_storage'

export async function saveE2EEKey(userId: string, keyHex: string): Promise<boolean> {
  try {
    await Keychain.setGenericPassword(userId, keyHex, {
      service: SERVICE_ID,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      cloudSync: true,
    })
    return true
  } catch (error) {
    console.error('Add key error:', error)
    return false
  }
}

export async function getE2EEKey(): Promise<{ userId: string; keyHex: string } | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_ID,
      cloudSync: true,
    })

    if (credentials) {
      return {
        userId: credentials.username,
        keyHex: credentials.password,
      }
    }
    return null
  } catch (error) {
    console.error('Get key error:', error)
    return null
  }
}

export async function resetE2EEKey(): Promise<boolean> {
  try {
    await Keychain.resetGenericPassword({
      service: SERVICE_ID,
      cloudSync: true,
    })
    return true
  } catch (error) {
    console.error('Delete key error:', error)
    return false
  }
}
