import Animated from "react-native-reanimated";
import { styles } from "./Gradient.styles";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function Gradient({ animatedStyle }) {
  return (
    <MaskedView
      style={styles.container}
      maskElement={
        <LinearGradient
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          colors={["#000000", "#00000000"]}
        />
      }
    >
      <Animated.View style={[animatedStyle, styles.view]} />
    </MaskedView>
  );
}
