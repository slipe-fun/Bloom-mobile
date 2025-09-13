import Header from "@components/settingsScreen/header";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useSnapScroll } from "@hooks/useSnapScroll";
import Animated from "react-native-reanimated";
import useSettingsScreenStore from "src/stores/settingsScreen";
import { useEffect } from "react";
import useInsets from "@hooks/useInsets";

export default function SettingsScreen() {
  const { headerHeight, setSnapEndPosition, snapEndPosition } = useSettingsScreenStore();
  const { scrollY, listRef, scrollHandler } = useSnapScroll(snapEndPosition);
  const insets = useInsets();

  useEffect(() => {
    setSnapEndPosition(141);
  }, []);

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} />
      <Animated.FlatList
        ref={listRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
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
