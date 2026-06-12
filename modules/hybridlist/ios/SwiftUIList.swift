import SwiftUI
import Combine

@available(iOS 16.0, *)
struct SwiftUIList: View {
    let data: [ListItemRecord]
    let theme: ListThemeRecord
    let contentInsetTop: Double
    let contentInsetBottom: Double
    let onItemPress: (Int, ListItemRecord) -> Void

    @State private var isKeyboardVisible = false
    
    private var listBackgroundColor: Color {
        Color(hex: theme.backgroundColor)
    }

    private var springyAnimation: Animation {
        .spring(response: 0.4, dampingFraction: 0.65, blendDuration: 0)
    }
    
    var body: some View {
        GeometryReader { geometry in
            ScrollViewReader { scrollProxy in
                ScrollView {
                    messageList(geometry: geometry)
                }
                .scrollIndicators(.hidden)
                .onAppear {
                    scrollToBottom(proxy: scrollProxy)
                }
                .onChange(of: data.count) { _ in
                    withAnimation(springyAnimation) {
                        scrollToBottom(proxy: scrollProxy)
                    }
                }
            }
        }
        .background(listBackgroundColor)
        .ignoresSafeArea(.container, edges: .top)
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) {_ in 
            isKeyboardVisible = true
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) {_ in 
            isKeyboardVisible = false
        }
    }
    
    private func messageList(geometry: GeometryProxy) -> some View {
        LazyVStack(spacing: 8) {
            ForEach(Array(data.enumerated()), id: \.element.id) { index, item in
                MessageCellView(item: item, theme: theme) {
                    onItemPress(index, item)
                }
                .padding(.horizontal, 16)
                .transition(.asymmetric(
                    insertion: .move(edge: .bottom).combined(with: .opacity),
                    removal: .opacity
                ))
                .id(item.id)
            }
        }
        .padding(.top, contentInsetTop)
        .padding(.bottom, isKeyboardVisible ? max(0, contentInsetBottom + 10) : contentInsetBottom)
        .animation(springyAnimation, value: contentInsetBottom)
        .frame(minHeight: geometry.size.height, alignment: .bottom)
        .animation(springyAnimation, value: data.count)
    }
    
    private func scrollToBottom(proxy: ScrollViewProxy) {
        if let lastId = data.last?.id {
            proxy.scrollTo(lastId, anchor: .bottom)
        }
    }
}