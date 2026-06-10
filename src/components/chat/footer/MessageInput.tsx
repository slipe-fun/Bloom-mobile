import { Input } from '@components/ui'
import { layoutAnimation, springy } from '@constants/animations'
import { PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import { useTranslation } from 'react-i18next'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
}

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function MessageInput({ setValue, value }: MessageInputProps) {
  const { t } = useTranslation('chat')

  return (
    // <Animated.View
    //   onTouchStart={() => handlePress(true)}
    //   onTouchMove={() => handlePress(false)}
    //   onTouchEnd={() => handlePress(false)}
    //   layout={layoutAnimation}
    //   style={[styles.messageInputWrapper, animatedStyle]}
    // >
    //   <AnimatedInput
    //     basic
    //     layout={layoutAnimation}
    //     numberOfLines={7}
    //     onChangeText={setValue}
    //     multiline
    //     submitBehavior="newline"
    //     size="md"
    //     returnKeyType="previous"
    //     value={value}
    //     placeholder="Cообщение..."
    //   />
    // </Animated.View>
    <Input
      value={value}
      size="md"
      viewStyle={{ flex: 1 }}
      elevated={true}
      onChangeText={setValue}
      placeholder={t('common:chats.footer.search.placeholder')}
      icon={
        <Icon
          size={22}
          uniProps={(theme) => ({ color: theme.colors.secondaryText })}
          animatedProps={animatedProps}
          icon="magnifyingglass"
        />
      }
      submitBehavior="blurAndSubmit"
      returnKeyType="search"
    />
  )
}
