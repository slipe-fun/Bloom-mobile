import { styles } from "./SearchView.styles";
import useChatsScreenStore from "@stores/ChatsScreen";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { fastSpring } from "@constants/Easings";
import { useUnistyles } from "react-native-unistyles";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { Text } from "react-native";
import { Icon } from "@components/ui";
import ChatItem from "@components/chatsScreen/ChatItem";
import useUsersSearch from "@hooks/api/useUsersSearch";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const opacityAnimation = {
  entering: FadeIn.springify()
    .mass(fastSpring.mass)
    .damping(fastSpring.damping)
    .stiffness(fastSpring.stiffness),
  exiting: FadeOut.springify()
    .mass(fastSpring.mass)
    .damping(fastSpring.damping)
    .stiffness(fastSpring.stiffness),
};

export default function SearchView() {
  const { headerHeight, focused, query } = useChatsScreenStore();
  const { theme } = useUnistyles();

  const { users, loading, error, addPage } = useUsersSearch(query);

  return focused ? (
    <Animated.View
      {...opacityAnimation}
      style={[styles.container, { paddingTop: headerHeight - 56 }]}
    >
      {query.length === 0 ? (
        <Animated.View
          key="empty"
          {...opacityAnimation}
          style={styles.textWrapper}
        >
          <Icon icon="magnifyingglass" size={92} color={theme.colors.primary} />
          <Text style={styles.title}>В поиске пусто</Text>
          <Text style={styles.subtitle}>
            Начните поиск чтобы здесь стало не так пусто!
          </Text>
        </Animated.View>
      ) : (
        <FlashList
          key="search"
          estimatedItemSize={7}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={30}
          data={users}
          renderItem={({item, index}) => <ChatItem isSearch item={item} index={index} />}
        />
      )}
    </Animated.View>
  ) : null;
}
