import Foundation
import Combine

class HybridListStore: ObservableObject {
    @Published var data: [ListItemRecord] = []
    @Published var theme: ListThemeRecord? = nil
    @Published var contentInsetTop: Double = 0
    @Published var contentInsetBottom: Double = 0
    @Published var lastSeenId: Int = 0
}