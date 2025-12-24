import { styles } from "./Header.styles";
import HeaderAvatar from "./avatar";
import { useInsets } from "@hooks";
import useSettingsScreenStore from "@stores/settingsScreen";
import UserInformation from "./user";
import { View } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";

type HeaderProps = {
    scrollY: SharedValue<number>;
    user: any;
}

export default function Header({ scrollY, user }: HeaderProps): React.JSX.Element {
  const insets = useInsets();
  const { setHeaderHeight } = useSettingsScreenStore();

  const onHeaderLayout = (e) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  return (
    <View onLayout={onHeaderLayout} style={styles.header(insets.top)}>
        <HeaderAvatar scrollY={scrollY} />
        <UserInformation scrollY={scrollY} user={user}/>
    </View>
  );
}
