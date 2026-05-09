import { Skia } from '@shopify/react-native-skia'

const shaderString = `
uniform vec2 islandCenter;
uniform vec2 islandHalfSize;
uniform float islandRadius;

uniform vec2 ballCenter;
uniform float ballRadius;

uniform float gooeyness;

float smin(float a, float b, float k) {
    if (k <= 0.0) return min(a, b);
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

vec4 main(vec2 pos) {
    float dIsland = sdRoundRect(pos - islandCenter, islandHalfSize, islandRadius);
    float dBall = sdCircle(pos - ballCenter, ballRadius);

    float clipPlane = islandCenter.y - pos.y + 6.0;
    float dBallClipped = max(dBall, clipPlane);

    float dMerged = smin(dIsland, dBallClipped, gooeyness);
    float alphaMerged = smoothstep(0.5, -0.5, dMerged);
    
    vec2 cutoutHalfSize = islandHalfSize + vec2(6.0, 0.0);
    
    float dIslandCutout = sdRoundRect(pos - islandCenter, cutoutHalfSize, islandRadius);
    float alphaIslandCutout = smoothstep(0.5, -0.5, dIslandCutout);
    
    float finalAlpha = clamp(alphaMerged - alphaIslandCutout, 0.0, 1.0);
    
    vec3 color = vec3(0.0, 0.0, 0.0);
    return vec4(color * finalAlpha, finalAlpha);
}
`

export const gooeyShader = Skia.RuntimeEffect.Make(shaderString)
