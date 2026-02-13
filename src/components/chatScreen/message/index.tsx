import type { Message as MessageType } from '@interfaces'
import { useLayoutEffect, useState } from 'react'
import { Pressable } from 'react-native'
import MessageBubble from './Bubble'
import { styles } from './Message.styles'
import StatusBubble from './StatusBubble'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
  shouldAnimate: boolean
}

export default function Message({ message, seen, marginBottom, shouldAnimate }: MessageProps) {
  const [mountFinished, setMountFinished] = useState(false)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    setMountFinished(!shouldAnimate)
  }, [message?.id])

  return (
    <Pressable style={[styles.messageWrapper(message?.isMe, marginBottom)]}>
      {!mountFinished && shouldAnimate && (
        <StatusBubble width={width} height={height} setMountFinished={setMountFinished} isActive={shouldAnimate} />
      )}
      <MessageBubble
        setHeight={setHeight}
        setWidth={setWidth}
        message={message}
        shouldAnimate={shouldAnimate}
        mountFinished={mountFinished}
      />
    </Pressable>
  )
}
