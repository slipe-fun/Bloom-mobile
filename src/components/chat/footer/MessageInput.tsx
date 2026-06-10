import { Input } from '@components/ui'
import { SIZE_MAP } from '@components/ui/input'
import { useTranslation } from 'react-i18next'
import SendButton from './SendButton'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
}

export default function MessageInput({ setValue, value }: MessageInputProps) {
  const { t } = useTranslation('chat')

  return (
    <Input
      value={value}
      size="md"
      viewStyle={{ flex: 1, borderRadius: SIZE_MAP.md / 2 + 2, height: 'auto', minHeight: SIZE_MAP.md }}
      elevated={true}
      multiline
      style={{ height: 'auto', minHeight: SIZE_MAP.md }}
      overlayStyle={{ borderRadius: SIZE_MAP.md / 2 + 2, height: 'auto', minHeight: SIZE_MAP.md }}
      numberOfLines={6}
      onChangeText={setValue}
      placeholder={t('chat:footer.input')}
      submitBehavior="blurAndSubmit"
      button={<SendButton hasValue={!!value.trim()} />}
      returnKeyType="search"
    />
  )
}
