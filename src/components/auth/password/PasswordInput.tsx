import React, { useEffect, useRef, useState } from "react";
import { Icon, Input } from "@components/ui";
import useAuthStore from "@stores/auth";
import { useUnistyles } from "react-native-unistyles";
import { Platform, Pressable, TextInput } from "react-native";
import Animated from "react-native-reanimated";
import { styles } from "./Input.styles";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";

export default function AuthPasswordInput(): React.JSX.Element {
  const { password, setPasssword, index } = useAuthStore();
  const [secure, setSecure] = useState<boolean>(true);
  const { theme } = useUnistyles();
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    ref.current?.blur();
  }, [index]);

  return (
    <Input
      ref={ref}
      value={password}
      onChangeText={setPasssword}
      maxLength={64}
      secureTextEntry={secure}
      keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "visible-password"}
      icon={<Icon size={26} icon='lock' color={theme.colors.secondaryText} />}
      placeholder='Пароль здесь'
      size='lg'
      button={
        <Pressable style={styles.secureButton} onPress={() => setSecure((prev) => !prev)}>
          {secure ? (
            <Animated.View key={45} entering={zoomAnimationIn} exiting={zoomAnimationOut}>
              <Icon color={theme.colors.secondaryText} icon='eye' />
            </Animated.View>
          ) : (
            <Animated.View key={46} entering={zoomAnimationIn} exiting={zoomAnimationOut}>
              <Icon color={theme.colors.secondaryText} icon='eye.slashed' />
            </Animated.View>
          )}
        </Pressable>
      }
    />
  );
}
