import React, { useEffect, useRef } from "react";
import { Icon, Input } from "@components/ui";
import useAuthStore from "@stores/auth";
import { useUnistyles } from "react-native-unistyles";
import { TextInput } from "react-native";

export default function AuthNickInput(): React.JSX.Element {
  const { username, setUsername, index } = useAuthStore();
  const { theme } = useUnistyles();
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    ref.current?.blur();
  }, [index]);

  return (
    <Input
      ref={ref}
      value={username}
      onChangeText={setUsername}
      maxLength={20}
      icon={<Icon size={24} icon='person' color={theme.colors.secondaryText} />}
      placeholder='a-Z . _ - 2-20 длина'
      size='lg'
    />
  );
}
