import { styles } from "./SearchView.styles";
import useChatsScreenStore from "@stores/ChatsScreen";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { fastSpring } from "@constants/easings";
import { useUnistyles } from "react-native-unistyles";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { Text } from "react-native";
import { Icon } from "@components/ui";
import ChatItem from "@components/chatsScreen/chat/ChatItem";
import useUsersSearch from "@api/hooks/useUsersSearch";
import useTabBarStore from "@stores/tabBar";
import { getFadeIn, getFadeOut } from "@constants/animations";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function SearchView() {
  const { headerHeight, query } = useChatsScreenStore();
  const { theme } = useUnistyles();
  const { isSearch } = useTabBarStore();

  const { users, loading, error, addPage } = useUsersSearch(query);

  return isSearch  ? (
    <Animated.View
    entering={getFadeIn()}
    exiting={getFadeOut()}
      style={[styles.container, { paddingTop: headerHeight - 56 }]}
    >
      {query.length === 0 ? (
        <Animated.View
          key="empty"
          
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
          keyboardShouldPersistTaps="handled"
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
