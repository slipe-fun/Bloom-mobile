import { Input } from '@components/ui'
import { SIZE_MAP } from '@components/ui/input'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import useChatStore from '@stores/chat'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LayoutChangeEvent } from 'react-native'
import SendButton from './SendButton'

type MessageInputProps = {
  handleSend: (item: string) => void
}

export default function MessageInput({ handleSend }: MessageInputProps) {
  const { t } = useTranslation('chat')
  const [value, setValue] = useState('')
  const insets = useInsets()
  const setFooterHeight = useChatStore((state) => state.setFooterHeight)

  const handleLayout = (event: LayoutChangeEvent) => {
    setFooterHeight(insets.bottom + event.nativeEvent.layout.height + base.spacing.xxl)
  }

  useEffect(() => {
    return () => setFooterHeight(0)
  }, [])

  return (
    <Input
      value={value}
      size="md"
      onLayout={handleLayout}
      viewStyle={{ flex: 1, borderRadius: SIZE_MAP.md / 2, height: 'auto', minHeight: SIZE_MAP.md }}
      elevated={true}
      multiline
      style={{ height: 'auto', minHeight: SIZE_MAP.md, paddingRight: base.spacing.sm }}
      overlayStyle={{ borderRadius: SIZE_MAP.md / 2, height: 'auto', minHeight: SIZE_MAP.md }}
      numberOfLines={6}
      onChangeText={setValue}
      placeholder={t('chat:footer.input')}
      submitBehavior="newline"
      button={<SendButton value={value} setValue={setValue} handleSend={handleSend} />}
      returnKeyType="default"
    />
  )
}
