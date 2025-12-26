import Header from "@components/settingsScreen/header";
import { View } from "react-native";
import { styles } from "./Settings.styles";
import { useSnapScroll } from "@hooks";
import useSettingsScreenStore from "@stores/settings";
import useGetMyself from "@api/hooks/useGetMyself";
import FloatingHeader from "@components/settingsScreen/header/FloatingHeader";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import React, { useCallback, useMemo } from "react";
import useTabBarStore from "@stores/tabBar";
import { SETTINGS_SECTIONS } from "@constants/settings";
import type { SettingsSection } from "@interfaces";
import { SettingsGroup } from "@components/ui";

export default function SettingsScreen(): React.JSX.Element {
  const { snapEndPosition } = useSettingsScreenStore();
  const { tabBarHeight } = useTabBarStore();
  const { scrollY, animatedRef, scrollHandler } = useSnapScroll<any>(snapEndPosition);
  const { user, error, loading } = useGetMyself();

  const keyExtractor = useCallback((item: SettingsSection) => {
    return String(item.id);
  }, []);

  const data = useMemo(() => SETTINGS_SECTIONS({ username: "dikiy", description: "dikiy 56655", friends: 30, theme: "Светлое", language: "Русский"}), [user, SETTINGS_SECTIONS])

  return (
    <View style={styles.container}>
      <FloatingHeader scrollY={scrollY} user={user} />
      <AnimatedLegendList
        ref={animatedRef}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<Header scrollY={scrollY} user={user} />}
        onScroll={scrollHandler}
        contentContainerStyle={styles.list(tabBarHeight)}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item: section }) => <SettingsGroup section={section} />}
      />
    </View>
  );
}
