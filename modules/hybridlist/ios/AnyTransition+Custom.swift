import SwiftUI

struct BlurAndOffsetModifier: ViewModifier {
    let offset: CGFloat
    let blur: CGFloat
    let opacity: CGFloat

    func body(content: Content) -> some View {
        content
            .offset(y: offset)
            .blur(radius: blur)
            .opacity(opacity)
    }
}

extension AnyTransition {
    static func blurAndOffset(y: CGFloat, blur: CGFloat) -> AnyTransition {
        .modifier(
            active: BlurAndOffsetModifier(offset: y, blur: blur, opacity: 0),
            identity: BlurAndOffsetModifier(offset: 0, blur: 0, opacity: 1)
        )
    }
}