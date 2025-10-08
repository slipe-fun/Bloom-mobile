import { styles } from "./Header.styles";
import { View, Text, Pressable } from "react-native";
import Icon from "@components/ui/Icon";
import FastImage from "@d11/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import useInsets from "@hooks/useInsets";
import { Avatar } from "@components/ui";

export default function Header({ chat }) {
  const navigation = useNavigation();
  const insets = useInsets();

  return (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Icon icon="chevron.left" size={24} color="black" />
      </Pressable>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{chat?.recipient?.username}</Text>
        <Text style={styles.time}>Last seen recently</Text>
      </View>
      <Avatar size="md" username={chat?.recipient?.username} />
    </View>
  );
}
