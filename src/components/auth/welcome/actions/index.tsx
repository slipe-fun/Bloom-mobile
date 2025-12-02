import { Button } from "@components/ui";
import { Icon, Separator } from "@components/ui";
import React, { useEffect } from "react";
import { Image, Platform, View } from "react-native";
import { styles } from "./Actions.styles";
import { useUnistyles } from "react-native-unistyles";
import useGoogleOauth2 from "@api/hooks/useGoogleOauth2";

export default function AuthActions(): React.JSX.Element {
  const { theme } = useUnistyles();
  const { result, loading, error, startGoogleAuth } = useGoogleOauth2();

  const iOS = Platform.OS === "ios";

  const focusedIcon = (value: boolean, light?: boolean) =>
    value ? (
      <Icon size={26} icon='apple.logo' color={light ? theme.colors.text : theme.colors.background} />
    ) : (
      <Image style={styles.imageIcon} source={require("@assets/logos/google.webp")} />
    );

  const onPress = async (method: string) => {
    if (method === "google") {
      await startGoogleAuth();
    }
  }

  return (
    <View style={styles.actionsContainer}>
      <Button
        style={styles.button(true)}
        labelStyle={styles.buttonLabel(true)}
        icon={focusedIcon(iOS)}
        label={iOS ? "Продолжить с Apple" : "Продолжить с Google"}
        onPress={() => onPress(iOS ? "apple" : "google")}
        size='xl'
        variant='textIcon'
      />

      <Separator label='ИЛИ' style={styles.separatorContainer} />
      <Button
        labelStyle={styles.buttonLabel(false)}
        icon={focusedIcon(!iOS, true)}
        label={!iOS ? "Продолжить с Apple" : "Продолжить с Google"}
        onPress={() => onPress(!iOS ? "apple" : "google")}
        size='xl'
        variant='textIcon'
      />
    </View>
  );
}