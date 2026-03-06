import { Skia } from '@shopify/react-native-skia'

const shaderString = `
uniform vec2 islandCenter;
uniform vec2 islandHalfSize;
uniform float islandRadius;

uniform vec2 ballCenter;
uniform float ballRadius;

uniform float gooeyness;

// Функция плавного слияния (Smooth Minimum)
float smin(float a, float b, float k) {
    if (k <= 0.0) return min(a, b); // Protection against division by zero
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
    float d1 = sdRoundRect(pos - islandCenter, islandHalfSize, islandRadius);
    float d2 = sdCircle(pos - ballCenter, ballRadius);
    float d = smin(d1, d2, gooeyness);
    
    float alpha = clamp(0.0 - d, 0.0, 1.0);
    
    // Skia requires Premultiplied Alpha! 
    // Multiply your RGB values by the alpha channel.
    vec3 color = vec3(0.0, 0.0, 0.0); 
    return vec4(color * alpha, alpha);
}
`

export const gooeyShader = Skia.RuntimeEffect.Make(shaderString)
