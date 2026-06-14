import SwiftUI
import Combine

@available(iOS 16.0, *)
struct SwiftUIList: View {
    @ObservedObject var store: HybridListStore

    let onItemPress: (Int, ListItemRecord) -> Void

    @State private var isKeyboardVisible = false
    
    private let bottomSpacerId = "BOTTOM_SPACER"
    
    private var listBackgroundColor: Color {
        store.parsedTheme?.backgroundColor ?? .clear
    }

    private var springyAnimation: Animation {
        .interpolatingSpring(
            mass: 0.2,
            stiffness: 120.0,
            damping: 12.0,
            initialVelocity: 0.0
        )
    }
    
    var body: some View {
        if let theme = store.parsedTheme {
            ScrollView {
                ScrollViewReader { proxy in
                    messageList(theme: theme)
                        .onChange(of: store.data.count) { _ in
                            withAnimation(springyAnimation) {
                                proxy.scrollTo(bottomSpacerId, anchor: .top)
                            }
                        }
                }
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
        } else {
            Color.clear
        }
    }
    
    private func messageList(theme: ParsedListTheme) -> some View {
        LazyVStack(spacing: 4) {
            Color.clear
                .frame(height: isKeyboardVisible ? store.contentInsetBottom + 12 : store.contentInsetBottom)
                .id(bottomSpacerId)

            ForEach(store.data.enumerated().reversed(), id: \.element.id) { index, item in
                let isSeen = item.id <= store.lastSeenId

                MessageCellView(item: item, theme: theme, isSeen: isSeen) {
                    if let index = store.data.firstIndex(of: item) {
                        onItemPress(index, item)
                    }
                }
                .equatable()
                .padding(.horizontal, 16)
                .scaleEffect(y: -1)
                .id(item.id) 
                .transition(.asymmetric(
                    insertion: .move(edge: .top).combined(with: .opacity),
                    removal: .opacity
                ))
            }
        }
        .padding(.bottom, store.contentInsetTop)
        .animation(springyAnimation, value: store.data)
    }
}