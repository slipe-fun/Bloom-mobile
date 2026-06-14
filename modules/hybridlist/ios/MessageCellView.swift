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
        let invisibleSpaceForTime = Text("\u{00A0}\u{00A0}" + item.date)
            .font(.custom("OpenRunde-Regular", size: 12))
            .foregroundColor(.clear)

        return (Text(item.content)
            .font(.custom("OpenRunde-Medium", size: 16))
            .foregroundColor(textColor)
            + invisibleSpaceForTime)
            .padding(.horizontal, 15)
            .padding(.vertical, 11)
            .frame(minWidth: 60, minHeight: 40, alignment: .leading)
            .background(backgroundColor)
            .cornerRadius(21)
            
            .overlay(
                Text(item.date)
                    .font(.custom("OpenRunde-Regular", size: 12))
                    .foregroundColor(textColor.opacity(0.5))
                    .padding(.trailing, 13)
                    .padding(.bottom, 9),
                alignment: .bottomTrailing
            )
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
                        Text(item.seen ?? "Read") 
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