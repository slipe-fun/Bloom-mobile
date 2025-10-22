import { quickSpring } from "@constants/easings";
import physicsSpring from "@lib/physicSpring";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import useContextMenuStore from "src/stores/contextMenu";

export default function useScreenScale() {
    const { focused } = useContextMenuStore();

    const springy = physicsSpring({ mass: quickSpring.mass, duration: 0.2, dampingRatio: 2.5})

    const animatedScreenStyle = useAnimatedStyle(() => ({
        transform: [{scale: withSpring(focused ? 0.94 : 1, springy)}]
    }))

    return { animatedScreenStyle }
}