import type { User } from '@interfaces'
import { restoreBytes } from '@lib/skid-v3/src/utils'

export default async function prepareForHanshake(storage, recipient: User) {
  let sender_keys: any
  try {
    sender_keys = {
      ...restoreBytes({ ...JSON.parse(storage.getString('identity_keys')) }),
      id: JSON.parse(storage.getString('session')).user_id,
    }
  } catch {
    return
  }

  const recipient_keys = {
    ...restoreBytes({
      ecdh: {
        public_key: recipient.ecdh_public_key,
      },
      ed: {
        public_key: recipient.ed_public_key,
      },
      ml_kem: {
        public_key: recipient.kyber_public_key,
      },
    }),
    id: recipient?.id,
  }

  return { sender_keys, recipient_keys }
}
