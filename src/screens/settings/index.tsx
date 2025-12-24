import Header from "@components/settingsScreen/header";
import { View } from "react-native";
import { styles } from "./Settings.styles";
import { useInsets, useSnapScroll } from "@hooks";
import useSettingsScreenStore from "src/stores/settingsScreen";
import { useEffect } from "react";
import useGetMyself from "@api/hooks/useGetMyself";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import FloatingHeader from "@components/settingsScreen/header/FloatingHeader";

export default function SettingsScreen() {
  const { headerHeight, setSnapEndPosition, snapEndPosition } = useSettingsScreenStore();
  const { scrollY, listRef, scrollHandler } = useSnapScroll(snapEndPosition);
  const { user, error, loading } = useGetMyself();
  const insets = useInsets()

  useEffect(() => {
    setSnapEndPosition(headerHeight - insets.top);
  }, []);

  return (
    <View style={styles.container}>
      <FloatingHeader scrollY={scrollY} user={user}/>
      <AnimatedLegendList
        ref={listRef}
        ListHeaderComponent={<Header scrollY={scrollY} user={user} />}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false} 
        data={[1,2,3,4,5,6,7,8,9]}
        renderItem={({ item }) => (
          <View
            key={item}
            style={{
              height: 100,
              marginBottom: 16,
              backgroundColor: 'blue',
              width: "100%",
            }}
          />
        )}
      />
    </View>
  );
}