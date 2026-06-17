import Foundation
import Combine
import SwiftUI

struct ParsedListTheme: Equatable {
    let backgroundColor: Color
    let textColor: Color
    let secondaryTextColor: Color
    let primaryColor: Color
    let whiteColor: Color
    let foregroundColor: Color

    init(from record: ListThemeRecord) {
        self.backgroundColor = Color(hex: record.backgroundColor)
        self.textColor = Color(hex: record.textColor)
        self.secondaryTextColor = Color(hex: record.secondaryTextColor)
        self.primaryColor = Color(hex: record.primaryColor)
        self.whiteColor = Color(hex: record.whiteColor)
        self.foregroundColor = Color(hex: record.foregroundColor)
    }
}

class HybridListStore: ObservableObject {
    @Published var data: [ListItemRecord] = []
    @Published var indexedItems: [IndexedListItem] = []
    @Published var parsedTheme: ParsedListTheme? = nil
    @Published var contentInsetTop: Double = 0
    @Published var contentInsetBottom: Double = 0
    @Published var lastSeenId: Int = 0
}