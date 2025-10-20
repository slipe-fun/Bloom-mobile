import { styles } from "./Header.styles";
import { View, Text, Pressable } from "react-native";
import Icon from "@components/ui/Icon";
import { useNavigation } from "@react-navigation/native";
import useInsets from "@hooks/useInsets";
import { Avatar, Button } from "@components/ui";
import { useUnistyles } from "react-native-unistyles";
import Menu from "@components/ui/menu";
import { useState } from "react";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { quickSpring } from "@constants/Easings";
import { Option } from "@components/ui/menu";
import { staticColor } from "unistyles";
import { Chat } from "@interfaces";

type HeaderProps = {
  chat?: Chat | null;
};

const options: Option[] = [
  { label: "Открыть профиль", icon: "person", color: staticColor.white, action: "swag" },
  { label: "Поиск", icon: "magnifyingglass", color: staticColor.primary, action: "swag" },
  { label: "Сменить обои", icon: "image", color: staticColor.yellow, action: "swag" },
  { label: "Удалить чат", icon: "lock", color: staticColor.orange, action: "swag" },
];

export default function Header({ chat }: HeaderProps): React.ReactNode {
  const { theme } = useUnistyles();
  const [open, setOpen] = useState<boolean>(false);

  const navigation = useNavigation();
  const insets = useInsets();

  const animatedViewStyles = useAnimatedStyle(() => {
    return { opacity: withSpring(open ? 0.5 : 1, quickSpring) };
  });

  return (
    <Animated.View style={[styles.header, { paddingTop: insets.top }, animatedViewStyles]}>
      <Button variant="icon" onPress={() => navigation.goBack()}>
        <Icon icon="chevron.left" size={24} color={theme.colors.text} />
      </Button>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{chat?.recipient?.username}</Text>
        <Text style={styles.time}>Была(а) недавно</Text>
      </View>

      <Menu options={options} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} onSelect={() => console.log(1)} trigger={<Avatar size="md" username={chat?.recipient?.username} />} />
    </Animated.View>
  );
}
