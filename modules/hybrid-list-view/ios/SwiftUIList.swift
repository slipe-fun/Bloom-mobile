import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8 * 17), (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 255, 255, 255)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

struct SwiftUIList: View {
    let data: [ListItemRecord]
    let theme: ListThemeRecord
    let onItemPress: (Int, ListItemRecord) -> Void
    
    var body: some View {
        List {
            ForEach(Array(data.enumerated()), id: \.element.id) { index, item in
                Button(action: {
                    onItemPress(index, item)
                }) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(item.content)
                            .font(.custom("OpenRunde-Medium", size: 16))
                            .foregroundColor(Color(hex: theme.whiteColor))
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(hex: theme.primaryColor))
                    .cornerRadius(8)
                }
                .buttonStyle(PlainButtonStyle())
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
                .listRowSeparator(.hidden)
            }
        }
        .listStyle(PlainListStyle())
        .background(Color(hex: theme.backgroundColor))
        .scrollContentBackground(.hidden) 
    }
}