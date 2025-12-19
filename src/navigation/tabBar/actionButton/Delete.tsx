import Animated from "react-native-reanimated";
import { styles } from "./ActionButton.styles";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import useChatsStore from "@stores/chats";
import { Text } from "react-native";

export default function TabBarActionButtonDelete(): React.JSX.Element {
  const { edit } = useChatsStore();
  

  return edit && (
    <>
      <Animated.View style={styles.deleteBackground} key="deleteStateBackground" entering={zoomAnimationIn} exiting={zoomAnimationOut} />
      <Text>pjfjsdiofjiosdjfiosdjfsjdifo</Text>
      </>
  );
}
