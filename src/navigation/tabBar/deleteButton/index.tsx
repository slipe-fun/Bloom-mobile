import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import { styles } from "./DeleteButton.styles";
import {
  charAnimationIn,
  charAnimationOut,
  layoutAnimationSpringy,
  vSlideAnimationIn,
  vSlideAnimationOut,
} from "@constants/animations";
import useChatsStore from "@stores/chats";
import { useMemo } from "react";
import { Icon } from "@components/ui";
import { useUnistyles } from "react-native-unistyles";

export default function TabBarActionButtonDelete(): React.JSX.Element {
  const { edit, selectedChats } = useChatsStore();
  const { theme } = useUnistyles();

  const countChars = useMemo(() => selectedChats.length.toString().split(""), [selectedChats]);

  return (
    <Animated.View
      layout={layoutAnimationSpringy}
      style={styles.deleteWrapper}
      entering={vSlideAnimationIn}
      exiting={vSlideAnimationOut}
    >
      <LayoutAnimationConfig skipEntering skipExiting>
        <Icon size={26} icon='trash' color={theme.colors.white} />
        <Animated.View layout={layoutAnimationSpringy} style={styles.deleteCharStack}>
          {countChars.map((char, i) => (
            <Animated.Text
              key={`${char}-${i}`}
              style={styles.deleteChar}
              entering={charAnimationIn}
              exiting={charAnimationOut}
              numberOfLines={1}
            >
              {char}
            </Animated.Text>
          ))}
        </Animated.View>
      </LayoutAnimationConfig>
    </Animated.View>
  );
}
