import { createSecureStorage } from '@lib/storage'

export default async function () {
  const storage = await createSecureStorage('user-storage')

  try {
    return JSON.parse(storage.getString('session'))
  } catch {}
}
