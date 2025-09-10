import { View, TextInput, Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Button from "@components/auth/button";
import Gradient from "@components/auth/gradient";
import useInsets from "@hooks/useInsets";
import { useAuth } from "@hooks/api/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useUnistyles } from "react-native-unistyles";
import { ROUTES } from "@constants/Routes";

export default function LoginScreen() {
  const insets = useInsets();
  const { login } = useAuth();
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <Gradient animatedStyle={styles.gradient} />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Назад</Text>
        </Pressable>
      </View>
      <View style={styles.actionsContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Вход</Text>
          <Text style={styles.description}>
            Введите имя пользователя и пароль для входа в аккаунт
          </Text>
        </View>
        <TextInput
          cursorColor={theme.colors.primaryPlaceholder}
          selectionColor={theme.colors.primaryPlaceholder}
          placeholderTextColor={theme.colors.primaryPlaceholder}
          placeholder="Юзернейм"
          autoCapitalize="none"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholderTextColor={theme.colors.primaryPlaceholder}
          placeholder="Пароль"
          style={styles.input}
          cursorColor={theme.colors.primaryPlaceholder}
          selectionColor={theme.colors.primaryPlaceholder}
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.description}>
          Уже есть аккаунт?{" "}
          <Text
            onPress={() => navigation.navigate(ROUTES.REGISTER)}
            style={[styles.description, { color: theme.colors.primary, fontFamily: theme.fontFamily.semibold }]}
          >
            Создать
          </Text>
        </Text>
      </View>
      <Button
        animatedStyle={styles.button}
        onPress={() => login(username, password)}
      >
        Войти
      </Button>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    backgroundColor: theme.colors.primary,
  },
  button: {
    width: "100%",
    backgroundColor: theme.colors.primary,
  },
  actionsContainer: {
    flex: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    paddingBottom: theme.spacing.lg,
  },
  backButton: {
    backgroundColor: theme.colors.primaryBackdrop,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    borderRadius: theme.radius.full,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fontFamily.semibold,
    lineHeight: theme.lineHeight.sm,
  },
  input: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    height: 44,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight.sm,
    fontFamily: theme.fontFamily.medium,
    zIndex: 1,
    color: theme.colors.primary,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryBackdrop,
    borderWidth: 0,
  },
  titleWrapper: {
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.semibold,
    lineHeight: theme.lineHeight.xxl,
    color: theme.colors.primary,
  },
  description: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.md,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
}));
