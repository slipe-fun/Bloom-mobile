import Header from "@components/settingsScreen/header";
import { View } from "react-native";
import { styles } from "./Settings.styles";
import { useSnapScroll } from "@hooks";
import Animated from "react-native-reanimated";
import useSettingsScreenStore from "src/stores/settingsScreen";
import { useEffect } from "react";
import useGetMyself from "@api/hooks/useGetMyself";

export default function SettingsScreen() {
  const { headerHeight, setSnapEndPosition, snapEndPosition } = useSettingsScreenStore();
  const { scrollY, listRef, scrollHandler } = useSnapScroll(snapEndPosition);
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
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        data={[1,2,3,4,5,6,7,8,9]}
        renderItem={({ item }) => (
          <View
            key={item}
            style={{
              height: 100,
              marginBottom: 10,
              backgroundColor: 'red',
              width: "100%",
            }}
          />
        )}
        contentContainerStyle={{ paddingTop: headerHeight }}
      />
    </View>
  );
}