import { styles } from "./Header.styles";
import { View, Text, Pressable } from "react-native";
import Icon from "@components/ui/Icon";
import { useNavigation } from "@react-navigation/native";
import { useInsets } from "@hooks";
import { Avatar, Button, GradientBlur } from "@components/ui";
import { useUnistyles, StyleSheet } from "react-native-unistyles";
import { Menu } from "@components/ui";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { quickSpring } from "@constants/easings";
import { staticColor } from "unistyles";
import { Chat, Option } from "@interfaces";
import { useContextMenu } from "@hooks";
import { BlurView } from "expo-blur";

type HeaderProps = {
  chat?: Chat | null;
  onLayout?: (value: number) => void;
};

const options: Option[] = [
  { label: "Открыть профиль", icon: "person", color: staticColor.white, action: "swag" },
  { label: "Поиск", icon: "magnifyingglass", color: staticColor.primary, action: "swag" },
  { label: "Сменить обои", icon: "image", color: staticColor.yellow, action: "swag" },
  { label: "Удалить чат", icon: "trash", color: staticColor.orange, action: "swag" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Header({ chat, onLayout }: HeaderProps): React.ReactNode {
  const { theme } = useUnistyles();
  const {isOpen, triggerProps, closeMenu, menuPosition, triggerAnimatedStyle} = useContextMenu();
  const navigation = useNavigation();
  const insets = useInsets();

  const animatedViewStyles = useAnimatedStyle(() => {
    return { opacity: withSpring(isOpen ? 0.5 : 1, quickSpring) };
  });

  return (
    <Animated.View onLayout={(e) => onLayout(e.nativeEvent.layout.height)} style={[styles.header, { paddingTop: insets.top }, animatedViewStyles]}>
      <GradientBlur direction="top-to-bottom"/>
      <Button style={styles.button} variant="icon" onPress={() => navigation.goBack()}>
        <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
        <Icon icon="chevron.left" size={24} color={theme.colors.text} />
      </Button>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{chat?.recipient?.username}</Text>
        <Text style={styles.time}>Была(а) недавно</Text>
      </View>

      <AnimatedPressable style={triggerAnimatedStyle} {...triggerProps}>
        <Avatar size="md" username={chat?.recipient?.username} />
      </AnimatedPressable>
      <Menu isOpen={isOpen} options={options} closeMenu={closeMenu} position={menuPosition} />
    </Animated.View>
  );
}
