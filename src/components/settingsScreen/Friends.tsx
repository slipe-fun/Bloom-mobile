import { Blur, Canvas, Fill, Group, Image, Paint, Shader, Skia, useImage } from '@shopify/react-native-skia'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated'

const { width } = Dimensions.get('window')

const ISLAND_WIDTH = 100
const ISLAND_HEIGHT = 30
const ISLAND_Y = -25
const ISLAND_R = 0

const CARD_SIZE = 100
const CARD_R = CARD_SIZE / 2
const START_Y = 100

const CENTER_X = width / 2

const gooeyShader = Skia.RuntimeEffect.Make(`
uniform vec2 islandCenter;
uniform vec2 islandHalfSize;
uniform float islandRadius;

uniform vec2 ballCenter;
uniform float ballRadius;

uniform float gooeyness;

// Функция плавного слияния (Smooth Minimum)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// SDF для прямоугольника со скругленными углами (Dynamic Island)
float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

// SDF для круга (Движущийся шар)
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

vec4 main(vec2 pos) {
    // 1. Считаем расстояние от текущего пикселя до Острова
    float d1 = sdRoundRect(pos - islandCenter, islandHalfSize, islandRadius);
    
    // 2. Считаем расстояние до Шара
    float d2 = sdCircle(pos - ballCenter, ballRadius);
    
    // 3. Математически сливаем их вместе (Gooey эффект)
    float d = smin(d1, d2, gooeyness);
    
    // 4. Идеальное сглаживание (Anti-aliasing) шириной ровно в 1 пиксель
    float alpha = clamp(0.5 - d, 0.0, 1.0);
    
    // Возвращаем черный цвет с идеальной прозрачностью по краям
    return vec4(0.0, 0.0, 0.0, alpha);
}
`)!

export default function TabFriends() {
  const scrollY = useSharedValue(0)
  const image = useImage('https://i.pinimg.com/736x/f8/40/56/f840564f611c2ed373ea289e18ec2113.jpg')

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const cardY = useDerivedValue(() => START_Y - scrollY.value)

  const ballScale = useDerivedValue(() => {
    return interpolate(cardY.value, [ISLAND_Y, START_Y], [0.35, 1], Extrapolation.CLAMP)
  })

  const imageOpacity = useDerivedValue(() => {
    return interpolate(cardY.value, [ISLAND_Y, START_Y], [0.35, 1], Extrapolation.CLAMP)
  })

  const currentRadius = useDerivedValue(() => CARD_R * ballScale.value)

  const uniforms = useDerivedValue(() => {
    return {
      islandCenter: [CENTER_X, ISLAND_HEIGHT / 2],
      islandHalfSize: [ISLAND_WIDTH / 2, ISLAND_HEIGHT / 2],
      islandRadius: ISLAND_R,
      ballCenter: [CENTER_X, cardY.value + CARD_R],
      ballRadius: currentRadius.value,
      gooeyness: 40.0,
    }
  })

  const clipPath = useDerivedValue(() => {
    const path = Skia.Path.Make()
    path.addCircle(CENTER_X, cardY.value + CARD_R, currentRadius.value)
    return path
  })

  const imageBlur = useDerivedValue(() => {
    return interpolate(cardY.value, [ISLAND_Y, START_Y], [8, 0], Extrapolation.CLAMP)
  })

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Canvas style={{ flex: 1 }}>
          <Fill>
            <Shader source={gooeyShader} uniforms={uniforms} />
          </Fill>

          {image && (
            <Group
              layer={
                <Paint blendMode="srcATop" opacity={imageOpacity}>
                  <Blur blur={imageBlur} />
                </Paint>
              }
            >
              <Group clip={clipPath}>
                <Group>
                  <Image image={image} x={CENTER_X - CARD_R} y={cardY} width={CARD_SIZE} height={CARD_SIZE} fit="cover" />
                </Group>
              </Group>
            </Group>
          )}
        </Canvas>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: START_Y, paddingBottom: 1000 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
