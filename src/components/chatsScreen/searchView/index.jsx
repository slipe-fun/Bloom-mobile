import { styles } from "./SearchView.styles";
import useChatsScreenStore from "@stores/ChatsScreen";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Text } from "react-native";

export default function SearchView() {
    const { headerHeight, focused } = useChatsScreenStore();

    return focused ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, {paddingTop: headerHeight - 56}]}>
            <Text style={{color: "red"}}>12</Text>
        </Animated.View>
    ) : null;
}