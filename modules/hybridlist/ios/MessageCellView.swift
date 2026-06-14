import SwiftUI

@available(iOS 16.0, *)
struct MessageCellView: View, Equatable {
    let item: ListItemRecord
    let theme: ParsedListTheme
    let isSeen: Bool
    let action: () -> Void

    static func == (lhs: MessageCellView, rhs: MessageCellView) -> Bool {
        lhs.item.id == rhs.item.id &&
        lhs.item.content == rhs.item.content &&
        lhs.isSeen == rhs.isSeen &&
        lhs.theme == rhs.theme
    }

    private var textColor: Color {
        item.me ? theme.whiteColor : theme.textColor
    }

    private var backgroundColor: Color {
        item.me ? theme.primaryColor : theme.foregroundColor
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

                VStack(alignment: item.me ? .trailing : .leading, spacing: 4) {
                    messageBubble
                    
                    if item.me && isSeen {
                        Text(item.content)
                            .font(.caption2)
                            .foregroundColor(theme.secondaryTextColor)
                            .transition(.opacity)
                    }
                }

                if !item.me {
                    Spacer(minLength: 55)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
        .animation(.spring(response: 0.4, dampingFraction: 0.65, blendDuration: 0), value: isSeen)
    }
}