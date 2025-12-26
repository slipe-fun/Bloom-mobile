import React from "react";
import { View } from "react-native";
import SettingsItem from "./settingsItem";
import type { SettingsSection } from "@interfaces";
import { styles } from "./SettingsGroup.styles";

type SettingsGroupProps = {
  section: SettingsSection
}

export default function SettingsGroup({ section }: SettingsGroupProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {section.items.map((settingItem, index) => (
        <SettingsItem key={settingItem.label + index} item={settingItem} />
      ))}
    </View>
  );
}
