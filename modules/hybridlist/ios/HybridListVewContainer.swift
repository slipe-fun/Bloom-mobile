import ExpoModulesCore
import SwiftUI

class HybridListViewContainer: ExpoView {
    let store = HybridListStore()

    private var hostingController: UIHostingController<SwiftUIList>?
    let onItemPress = EventDispatcher()


    var data: [ListItemRecord] = [] {
        didSet { store.data = data }
    }
    
    var theme: ListThemeRecord? {
        didSet { store.theme = theme }
    }

    var contentInsetTop: Int = 0 {
        didSet { store.contentInsetTop = contentInsetTop }
    }
    
    var contentInsetBottom: Int = 0 {
        didSet { store.contentInsetBottom = contentInsetBottom }
    }

    var lastSeenId: Int = 0 {
        didSet { store.lastSeenId = lastSeenId }
    }

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        setupHostingController()
    }

    private func setupHostingController() {
            
            if #available(iOS 16.0, *) {
                let swiftUIView = SwiftUIList(store: store) { index, item in
                    self.onItemPress([
                        "index": index,
                        "item": [
                            "id": item.id,
                            "content": item.content,
                            "seen": item.seen ?? NSNull(),
                            "date": item.date,
                            "me": item.me,
                            "nonce": item.nonce,
                            "chatId": item.chatId,
                            "authorId": item.authorId,
                            "groupEnd": item.groupEnd,
                            "groupStart": item.groupStart,
                        ]
                    ])
                }
                
                let hosting = UIHostingController(rootView: swiftUIView)
                hosting.view.backgroundColor = .clear
                hosting.view.insetsLayoutMarginsFromSafeArea = false
                hosting.view.clipsToBounds = true
                hosting.view.translatesAutoresizingMaskIntoConstraints = false
        
                elf.addSubview(hosting.view)
        
                NSLayoutConstraint.activate([
                    hosting.view.topAnchor.constraint(equalTo: self.topAnchor),
                    hosting.view.bottomAnchor.constraint(equalTo: self.bottomAnchor),
                    hosting.view.leadingAnchor.constraint(equalTo: self.leadingAnchor),
                    hosting.view.trailingAnchor.constraint(equalTo: self.trailingAnchor)
                ])
        
                self.hostingController = hosting
            }
    }
}
