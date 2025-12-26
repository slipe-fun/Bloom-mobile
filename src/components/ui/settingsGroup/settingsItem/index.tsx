import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { SettingsItem as SettingsItemType } from "@interfaces";
import SettingsIcon from "../settingsIcon";
import Icon from "../../Icon";
import { styles } from "./SettingsItem.styles";

interface SettingsItemProps {
  item: SettingsItemType;
}

export default function SettingsItem({ item }: SettingsItemProps): React.JSX.Element {
  const { theme } = useUnistyles();

  const iconColor = theme.colors[item.color] ?? theme.colors.primary 

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container(false)}>
      <SettingsIcon 
        icon={item.icon} 
        type={item.iconType} 
        color={iconColor} 
      />

      <View style={styles.content}>
        <Text style={styles.label}>{item.label}</Text>

        <View style={styles.rightSide}>
          {item.badgeLabel && (
            <Text style={styles.badgeLabel}>{item.badgeLabel}</Text>
          )}
          <Icon icon={item.badgeIcon ?? "chevron.right"} size={item.badgeIcon ? 24 : 20} color={theme.colors.secondaryText} />
        </View>
      </View>
    </TouchableOpacity>
  );
};