import { Input } from '@components/ui'
import { SIZE_MAP } from '@components/ui/input'
import { base } from '@design/base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SendButton from './SendButton'

type MessageInputProps = {
  handleSend: (item: string) => void
}

export default function MessageInput({ handleSend }: MessageInputProps) {
  const { t } = useTranslation('chat')
  const [value, setValue] = useState('')

  return (
    <Input
      value={value}
      size="md"
      viewStyle={{ flex: 1, borderRadius: SIZE_MAP.md / 2, height: 'auto', minHeight: SIZE_MAP.md }}
      elevated={true}
      multiline
      style={{ height: 'auto', minHeight: SIZE_MAP.md, paddingRight: base.spacing.sm }}
      overlayStyle={{ borderRadius: SIZE_MAP.md / 2, height: 'auto', minHeight: SIZE_MAP.md }}
      numberOfLines={6}
      onChangeText={setValue}
      placeholder={t('chat:footer.input')}
      submitBehavior="blurAndSubmit"
      button={<SendButton value={value} setValue={setValue} handleSend={handleSend} />}
      returnKeyType="send"
    />
  )
}
