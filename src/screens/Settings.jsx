import Header from "@components/settingsScreen/header";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useSnapScroll } from "@hooks/useSnapScroll";
import Animated from "react-native-reanimated";
import useSettingsScreenStore from "src/stores/settingsScreen";
import { useEffect } from "react";
import useInsets from "@hooks/useInsets";
import useGetMyself from "@api/hooks/useGetMyself";

export default function SettingsScreen() {
  const { headerHeight, setSnapEndPosition, snapEndPosition } = useSettingsScreenStore();
  const { scrollY, listRef, scrollHandler } = useSnapScroll(snapEndPosition);
  const insets = useInsets();
  const { user, error, loading } = useGetMyself();

  useEffect(() => {
    setSnapEndPosition(141);
  }, []);

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} user={user} />
      <Animated.FlatList
        ref={listRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={[]}
        renderItem={({ item }) => (
          <View
            key={item}
            style={{
              height: 100,
              backgroundColor: "red",
              marginBottom: 10,
              width: "100%",
            }}
          />
        )}
        sections={[]}
        contentContainerStyle={{ paddingTop: headerHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
