import * as Keychain from 'react-native-keychain'

const SERVICE_ID = 'pw.bloom.app.icloud_storage'
const ACCESS_GROUP = '8V2F65476R.pw.bloom.app'

export async function saveE2EEKey(userId: string, key: string): Promise<boolean> {
  try {
    await Keychain.setGenericPassword(userId, key, {
      service: SERVICE_ID,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      cloudSync: true,
      accessGroup: ACCESS_GROUP,
    })
    return true
  } catch (error) {
    console.error('Add key error:', error)
    return false
  }
}

export async function getE2EEKey(): Promise<{ userId: string; key: string } | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_ID,
      cloudSync: true,
      accessGroup: ACCESS_GROUP,
    })

    if (credentials) {
      return {
        userId: credentials.username,
        key: credentials.password,
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
      accessGroup: ACCESS_GROUP,
    })
    return true
  } catch (error) {
    console.error('Delete key error:', error)
    return false
  }
}
