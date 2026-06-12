import SwiftUI

@available(iOS 16.0, *)
struct MessageCellView: View {
    let item: ListItemRecord
    let theme: ListThemeRecord
    let action: () -> Void

    private var textColor: Color {
        Color(hex: item.me ? theme.whiteColor : theme.textColor)
    }

    private var backgroundColor: Color {
        Color(hex: item.me ? theme.primaryColor : theme.foregroundColor)
    }

    private var messageBubble: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(item.content)
                .font(.custom("OpenRunde-Medium", size: 16))
                .foregroundColor(textColor)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(minWidth: 60, minHeight: 44)
        .background(backgroundColor)
        .cornerRadius(26)
    }

    var body: some View {
        Button(action: action) {
            HStack {
                if item.me {
                    Spacer(minLength: 55)
                }

                messageBubble

                if !item.me {
                    Spacer(minLength: 55)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}