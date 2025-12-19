import Animated from "react-native-reanimated";
import { styles } from "./DeleteButton.styles";
import {
  charAnimationIn,
  charAnimationOut,
  getFadeIn,
  getFadeOut,
  layoutAnimationSpringy,
  zoomAnimationIn,
  zoomAnimationOut,
} from "@constants/animations";
import useChatsStore from "@stores/chats";
import { Text } from "react-native";
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
      entering={getFadeIn()}
      exiting={getFadeOut()}
    >
      <Animated.View
        style={styles.deleteBackground}
        key='deleteStateBackground'
        entering={zoomAnimationIn}
        exiting={zoomAnimationOut}
      />
      <Icon size={24} icon='trash' color={theme.colors.white} />
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
    </Animated.View>
  );
}
