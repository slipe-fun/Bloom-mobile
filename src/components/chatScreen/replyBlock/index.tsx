import { Button, Icon } from "@components/ui";
import React from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { styles } from "./replyBlock.styles";
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from "@constants/animations";
import { useUnistyles } from "react-native-unistyles";

type ReplyBlockProps = {
  user: string;
  message: string;
  onCancel?: () => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function ReplyBlock({ user, message, onCancel }: ReplyBlockProps): React.JSX.Element {
  const { theme } = useUnistyles();

  return (
    message &&
    user && (
      <View style={styles.replyWrapper}>
        <Animated.View
          exiting={getFadeOut()}
          entering={getFadeIn()}
          layout={layoutAnimationSpringy}
          style={styles.replyChild}
        >
          <View style={styles.replyTo}>
            <Text style={styles.replyToName} numberOfLines={1}>В ответ {user}</Text>
            <Text style={styles.replyToMessage} numberOfLines={1}>{message}</Text>
          </View>
          {onCancel && (
            <AnimatedButton
              onPress={() => onCancel()}
              layout={layoutAnimationSpringy}
              variant='icon'
              style={styles.button}
            >
              <Icon color={theme.colors.secondaryText} icon='star' />
            </AnimatedButton>
          )}
        </Animated.View>
      </View>
    )
  );
}
