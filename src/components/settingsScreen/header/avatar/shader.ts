import { Skia } from '@shopify/react-native-skia'

export const gooeyShader = Skia.RuntimeEffect.Make(`
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
`)
