import { Input } from '@components/ui'
import type React from 'react'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
}

export default function MessageInput({ setValue, value }: MessageInputProps): React.JSX.Element {
  return (
    <Input
      numberOfLines={7}
      onChangeText={setValue}
      multiline
      submitBehavior="newline"
      size="md"
      viewStyle={{ flex: 1, width: 'auto' }}
      returnKeyType="previous"
      value={value}
      placeholder="Cообщение..."
    />
  )
}
