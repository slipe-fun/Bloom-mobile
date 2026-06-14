import SwiftUI
import Combine

@available(iOS 16.0, *)
struct SwiftUIList: View {
    let data: [ListItemRecord]
    let theme: ListThemeRecord
    let contentInsetTop: Int
    let lastSeenId: Int
    let contentInsetBottom: Int
    let onItemPress: (Int, ListItemRecord) -> Void

    @State private var isKeyboardVisible = false
    
    private var listBackgroundColor: Color {
        Color(hex: theme.backgroundColor)
    }

    private var springyAnimation: Animation {
        .spring(response: 0.4, dampingFraction: 0.65, blendDuration: 0)
    }
    
    var body: some View {
        ScrollView {
            messageList()
        }
        .scrollIndicators(.hidden)
        .scaleEffect(y: -1) 
        .background(listBackgroundColor)
        .ignoresSafeArea(.container, edges: .top)
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) { _ in 
            isKeyboardVisible = true
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in 
            isKeyboardVisible = false
        }
    }
    
    private func messageList() -> some View {
        LazyVStack(spacing: 8) {
            ForEach(Array(data.enumerated()).reversed(), id: \.element.id) { index, item in
                MessageCellView(item: item, theme: theme) {
                    onItemPress(index, item)
                }
                .padding(.horizontal, 16)
                .scaleEffect(y: -1)
                .transition(.asymmetric(
                    insertion: .move(edge: .top).combined(with: .opacity),
                    removal: .opacity
                ))
            }
        }
        .padding(.bottom, contentInsetTop)
        .padding(.top, isKeyboardVisible ? contentInsetBottom + 10 : contentInsetBottom)
        .animation(springyAnimation, value: data.count)
    }
}