// format
// [{ chat_id, kyberSecretKey, ecdhSecretKey, edSecretKey }, ...]

export default function (mmkv) {
    let chats;
    try {
      chats = JSON.parse(mmkv.getString("chats"))
    } catch {
      chats = []
    }

    return chats.map(chat => { 
        const _keys = chat?.keys?.my;
        if (!_keys) return {};
        return {
            chat_id: chat?.id,
            kyberPublicKey: _keys.kyberPublicKey,
            ecdhPublicKey: _keys.ecdhPublicKey,
            edPublicKey: _keys.edPublicKey,
            kyberSecretKey: _keys.kyberSecretKey,
            ecdhSecretKey: _keys.ecdhSecretKey,
            edSecretKey: _keys.edSecretKey
        }
    });
}