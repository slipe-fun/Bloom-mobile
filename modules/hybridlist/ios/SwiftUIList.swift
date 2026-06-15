import SwiftUI
import Combine

struct IndexedListItem: Identifiable, Equatable {
    let index: Int
    let element: ListItemRecord
    
    var id: ListItemRecord.ID { element.id }
    
    static func == (lhs: IndexedListItem, rhs: IndexedListItem) -> Bool {
        lhs.index == rhs.index && lhs.element.id == rhs.element.id
    }
}

struct KeyboardSpacer: View {
    let contentInsetBottom: CGFloat
    @State private var keyboardHeight: CGFloat = 0

    var body: some View {
        Color.clear
            .frame(height: keyboardHeight + contentInsetBottom)
            .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) { notification in 
                if let keyboardFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
                    withAnimation(.springy) {
                        self.keyboardHeight = keyboardFrame.height - 16
                    }
                }
            }
            .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in 
                withAnimation(.springy) {
                    self.keyboardHeight = 0
                }
            }
    }
}

@available(iOS 16.0, *)
struct SwiftUIList: View {
    @ObservedObject var store: HybridListStore
    let onItemPress: (Int, ListItemRecord) -> Void
    
    private var listBackgroundColor: Color {
        store.parsedTheme?.backgroundColor ?? .clear
    }
    
    private var indexedData: [IndexedListItem] {
        store.data.enumerated().map { 
            IndexedListItem(index: $0.offset, element: $0.element) 
        }
    }
    
    var body: some View {
        if let theme = store.parsedTheme {
            PureListView(
                items: indexedData,
                theme: theme,
                lastSeenId: store.lastSeenId,
                contentInsetBottom: store.contentInsetBottom,
                contentInsetTop: store.contentInsetTop,
                onItemPress: onItemPress
            )
            .background(listBackgroundColor)
        } else {
            Color.clear
        }
    }
}

@available(iOS 16.0, *)
struct PureListView: View, Equatable {
    let items: [IndexedListItem]
    let theme: ParsedListTheme
    let lastSeenId: Int
    let contentInsetBottom: CGFloat
    let contentInsetTop: CGFloat
    let onItemPress: (Int, ListItemRecord) -> Void
    
    private let bottomSpacerId = "BOTTOM_SPACER"
    
    static func == (lhs: PureListView, rhs: PureListView) -> Bool {
        lhs.lastSeenId == rhs.lastSeenId &&
        lhs.contentInsetBottom == rhs.contentInsetBottom &&
        lhs.contentInsetTop == rhs.contentInsetTop &&
        lhs.theme == rhs.theme &&
        lhs.items == rhs.items
    }
    
    var body: some View {
        ScrollView {
            ScrollViewReader { proxy in
                LazyVStack(spacing: 4) {
                    KeyboardSpacer(contentInsetBottom: contentInsetBottom)
                        .id(bottomSpacerId)

                    ForEach(items) { indexedItem in
                        let isSeen = indexedItem.element.id <= lastSeenId

                        MessageCellView(item: indexedItem.element, theme: theme, isSeen: isSeen) {
                            onItemPress(indexedItem.index, indexedItem.element)
                        }
                        .equatable()
                        .padding(.horizontal, 16)
                        .scaleEffect(y: -1)
                        .id(indexedItem.element.id) 
                        .transition(.asymmetric(
                            insertion: .move(edge: .top).combined(with: .opacity),
                            removal: .opacity
                        ))
                    }
                }
                .animation(.springy, value: items)
                .animation(.springy, value: contentInsetBottom)
                .padding(.bottom, contentInsetTop)
                .onChange(of: items.count) { _ in
                    withAnimation(.springy) {
                        proxy.scrollTo(bottomSpacerId, anchor: .top)
                    }
                }
            }
        }
        .scrollIndicators(.hidden)
        .scaleEffect(y: -1)
        .scrollDismissesKeyboard(.immediately)
        .ignoresSafeArea(.container, edges: .top)
        .ignoresSafeArea(.keyboard, edges: .vertical)
    }
}