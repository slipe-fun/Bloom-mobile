import SwiftUI

extension Animation {
    static var springy: Animation {
        .interpolatingSpring(
            mass: 0.2,
            stiffness: 120.0,
            damping: 12.0,
            initialVelocity: 0.0
        )
    }
}