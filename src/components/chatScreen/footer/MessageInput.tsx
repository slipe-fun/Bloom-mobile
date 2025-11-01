import React from "react";
import { styles } from "./Footer.styles";
import { layoutAnimationSpringy, zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { Button, Icon } from "@components/ui";
import { useUnistyles } from "react-native-unistyles";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import { TextInput } from "react-native-gesture-handler";
import { View } from "react-native";
import ReplyBlock from "../replyBlock";
import useChatScreenStore from "@stores/chatScreen";

type MessageInputProps = {
  setValue: (value: string) => void;
  hasValue: boolean;
  value: string;
};

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function MessageInput({ setValue, hasValue, value }: MessageInputProps): React.JSX.Element {
  const { theme } = useUnistyles();
  const { replyMessage, setReplyMessage } = useChatScreenStore();

  return (
    <Animated.View style={styles.inputWrapper} layout={layoutAnimationSpringy}>
      <AnimatedBlurView
        layout={layoutAnimationSpringy}
        style={styles.blur}
        intensity={40}
        tint='systemChromeMaterialDark'
      />
      <ReplyBlock onCancel={() => setReplyMessage(null)} message={replyMessage.content} user={replyMessage.content}/>
      <View style={styles.inputWrapperChild}>
        <TextInput
          style={styles.input}
          onChangeText={setValue}
          numberOfLines={7}
          keyboardAppearance='dark'
          multiline
          submitBehavior='newline'
          cursorColor={theme.colors.secondaryText}
          selectionColor={theme.colors.secondaryText}
          returnKeyType='previous'
          value={value}
          placeholderTextColor={theme.colors.secondaryText}
          placeholder='Cообщение...'
        />
        {hasValue ? (
          <AnimatedButton
            layout={layoutAnimationSpringy}
            style={styles.button(true)}
            key='smile'
            exiting={zoomAnimationOut}
            entering={zoomAnimationIn}
            variant='icon'
          >
            <Icon icon='face.smile' size={24} color={theme.colors.text} />
          </AnimatedButton>
        ) : (
          <AnimatedButton
            layout={layoutAnimationSpringy}
            style={styles.button(true)}
            key='waveform'
            exiting={zoomAnimationOut}
            entering={zoomAnimationIn}
            variant='icon'
          >
            <Icon icon='waveform' size={24} color={theme.colors.text} />
          </AnimatedButton>
        )}
      </View>
    </Animated.View>
  );
}
