import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Button from "@components/auth/button";
import { useState } from "react";
import { useUnistyles } from "react-native-unistyles";
import { useInsets } from "@hooks";
import Slider from "@components/auth/welcomeScreen/slider";
import { useSharedValue, useAnimatedStyle, interpolateColor } from "react-native-reanimated";
import Gradient from "@components/auth/gradient";
import { ROUTES } from "@constants/Routes";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const insets = useInsets();
  const position = useSharedValue(0);
  const offset = useSharedValue(0);

  const slides = [
    {
      color: theme.colors.primary,
      title: "Безопасный",
      icon: "lock",
      description: "Все сообщения и звонки шифруются с помощью шифрования E2E",
    },
    {
      color: theme.colors.orange,
      title: "Молниеносный",
      icon: "lightbolt",
      description: "Сообщения доставляются мгновенно — без задержек и промедлений",
    },
    {
      color: theme.colors.pink,
      title: "Простой и красивый",
      icon: "star",
      description: "Простой дизайн, понятный интерфейс, все под рукой",
    },
    {
      color: theme.colors.yellow,
      title: "Групповые чаты",
      icon: "compass",
      description: "Общайся с людьми со всего мира — быстро и просто",
    },
    {
      color: theme.colors.cyan,
      title: "Чаты и звонки",
      icon: "message",
      description: "Наслаждайтесь частными и групповыми разговорами с кристально чистым качеством звука",
    },
  ];

   const animatedStyle = useAnimatedStyle(() => {
      const slideProgress = position.value + offset.value;
      const backgroundColor = interpolateColor(
        slideProgress,
        [activeSlide - 1, activeSlide, activeSlide + 1],
        [slides[(activeSlide - 1 + slides.length) % slides.length]?.color, slides[activeSlide]?.color, slides[(activeSlide + 1) % slides.length]?.color],
      );
  
      return {
        backgroundColor,
      };
    });

  return (
    <View style={styles.container}>
      <Gradient animatedStyle={animatedStyle} />
      <Slider page={activeSlide} slides={slides} setPage={setActiveSlide} position={position} offset={offset}/>
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + theme.spacing.lg }]}>
        <Button
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
          animatedStyle={animatedStyle}
          shimmer
        >
         Начать общение!
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
}));
