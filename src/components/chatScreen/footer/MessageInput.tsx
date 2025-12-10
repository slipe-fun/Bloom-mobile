import React from "react";
import { styles } from "./Footer.styles";
import { layoutAnimationSpringy } from "@constants/animations";
import { useUnistyles } from "react-native-unistyles";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import ReplyBlock from "../replyBlock";
import useChatScreenStore from "@stores/chatScreen";
import { Input } from "@components/ui";

type MessageInputProps = {
  setValue: (value: string) => void;
  hasValue: boolean;
  value: string;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function MessageInput({ setValue, hasValue, value }: MessageInputProps): React.JSX.Element {
  const { replyMessage, setReplyMessage } = useChatScreenStore();

  return (
    <Animated.View style={styles.inputWrapper} layout={layoutAnimationSpringy}>
      <AnimatedBlurView
        layout={layoutAnimationSpringy}
        style={styles.blur}
        intensity={40}
        tint='systemChromeMaterialDark'
      />
      <ReplyBlock onCancel={() => setReplyMessage(null)} message={replyMessage} />

      <Input
        numberOfLines={7}
        onChangeText={setValue}
        multiline
        submitBehavior='newline'
        basic
        size="md"
        returnKeyType='previous'
        value={value}
        placeholder='Cообщение...'
      />
    </Animated.View>
  );
}
