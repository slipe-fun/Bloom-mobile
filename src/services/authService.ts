import { authApi } from '@api/auth.api'
import { bytesToBase64, restoreBytes } from '@lib/skid-v3/src/utils'
import { ed448 } from '@noble/curves/ed448.js'

let skidInstance: any = null
// biome-ignore lint/suspicious/noAssignInExpressions: <explanaton>
const getSkid = async () => (skidInstance ||= (await import('@lib/skid-v3')).default())

export const authService = {
  async login(userId: string, recoveryKey: Uint8Array) {
    const skid = await getSkid()
    const begin = await authApi.loginBegin(userId)

    const pubKeys = restoreBytes(begin.keys.identity_keys.public_keys)
    const pk = {
      ml_kem: { public_key: pubKeys.ml_kem_public_key },
      ecdh: { public_key: pubKeys.ecdh_public_key },
      ed: { public_key: pubKeys.ed_public_key },
    }

    const masterKey = skid.keys.master_key.decrypt(restoreBytes(begin.keys.encrypted_master_key), recoveryKey, pk.ed.public_key)
    const decryptedId = skid.keys.identity.decrypt(
      restoreBytes(begin.keys.identity_keys.encrypted_secret_keys),
      pk,
      masterKey,
      pk.ed.public_key,
    )

    const identity = {
      ml_kem: { public_key: pk.ml_kem.public_key, secret_key: decryptedId.ml_kem_secret_key },
      ecdh: { public_key: pk.ecdh.public_key, secret_key: decryptedId.ecdh_secret_key },
      ed: { public_key: pk.ed.public_key, secret_key: decryptedId.ed_secret_key },
    }

    const msg = new TextEncoder().encode(JSON.stringify({ challenge: begin.challenge, user_id: userId }))
    const sig = ed448.sign(msg, identity.ed.secret_key, { context: new Uint8Array(0) })
    const finish = await authApi.loginFinish(userId, bytesToBase64(sig))

    if (!finish?.user) throw new Error('Не удалось завершить вход')
    return {
      token: finish.token,
      session: finish.session,
      identity_keys: bytesToBase64(identity),
      master_key: bytesToBase64(masterKey),
    }
  },

  async register() {
    const skid = await getSkid()
    const id = skid.keys.identity.generate()
    const master = skid.keys.master_key.generate()
    const recovery = skid.keys.recovery_key.generate()

    const body = {
      identity_keys: {
        encrypted_secret_keys: bytesToBase64(skid.keys.identity.encrypt(id, master, id.ed.secret_key)),
        public_keys: bytesToBase64({
          ml_kem_public_key: id.ml_kem.public_key,
          ecdh_public_key: id.ecdh.public_key,
          ed_public_key: id.ed.public_key,
        }),
      },
      encrypted_master_key: bytesToBase64(skid.keys.master_key.encrypt(master, recovery, id.ed.secret_key)),
    }

    const res = await authApi.register(body)
    if (!res?.user) throw new Error('Не удалось зарегистрироваться')

    return {
      userId: res.user.id,
      token: res.token,
      session: res.session,
      identity_keys: bytesToBase64(id),
      master_key: bytesToBase64(master),
      recovery_key: bytesToBase64(recovery),
    }
  },
}
