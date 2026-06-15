import SwiftUI
import Combine

@available(iOS 16.0, *)
struct SwiftUIList: View {
    @ObservedObject var store: HybridListStore

    let onItemPress: (Int, ListItemRecord) -> Void

    @State private var keyboardHeight: CGFloat = 0
    
    private let bottomSpacerId = "BOTTOM_SPACER"
    
    private var listBackgroundColor: Color {
        store.parsedTheme?.backgroundColor ?? .clear
    }
    
    var body: some View {
        if let theme = store.parsedTheme {
            ScrollView {
                ScrollViewReader { proxy in
                    messageList(theme: theme)
                        .onChange(of: store.data.count) { _ in
                            withAnimation(.springy) {
                                proxy.scrollTo(bottomSpacerId, anchor: .top)
                            }
                        }
                }
            }
            .scrollIndicators(.hidden)
            .scaleEffect(y: -1)
            .background(listBackgroundColor)
            .scrollDismissesKeyboard(.immediately)
            .ignoresSafeArea(.container, edges: .top)
            .ignoresSafeArea(.keyboard, edges: .vertical)
            .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) { notification in 
                if let keyboardFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
                    withAnimation(.springy) {
                        self.keyboardHeight = keyboardFrame.height - 12
                    }
                }
            }
            .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in 
                withAnimation(.springy) {
                    self.keyboardHeight = 0
                }
            }
        } else {
            Color.clear
        }
    }
    
    private func messageList(theme: ParsedListTheme) -> some View {
        LazyVStack(spacing: 4) {
            Color.clear
                .frame(height: keyboardHeight + store.contentInsetBottom)
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
        .animation(.springy, value: store.data)
        .animation(.springy, value: store.contentInsetBottom)
    }
}