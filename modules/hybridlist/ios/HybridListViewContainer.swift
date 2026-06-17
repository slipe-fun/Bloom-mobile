import ExpoModulesCore
import SwiftUI

class HybridListViewContainer: ExpoView {
    let store = HybridListStore()

    private var hostingController: UIViewController?
    let onItemPress = EventDispatcher()

    var data: [ListItemRecord] = [] {
        didSet { 
            store.data = data

            store.indexedItems = data.enumerated().map {
                IndexedListItem(index: $0.offset, element: $0.element)
            }
        }
    }
    
    var theme: ListThemeRecord? {
        didSet { 
            if let theme = theme {
                store.parsedTheme = ParsedListTheme(from: theme)
            } 
        }
    }

    var contentInsetTop: Double = 0 {
        didSet { store.contentInsetTop = contentInsetTop }
    }
    
    var contentInsetBottom: Double = 0 {
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
            let swiftUIView = SwiftUIList(store: store) { [weak self] index, item in
                guard let self = self else { return }
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
    
            self.addSubview(hosting.view)
    
            NSLayoutConstraint.activate([
                hosting.view.topAnchor.constraint(equalTo: self.topAnchor),
                hosting.view.bottomAnchor.constraint(equalTo: self.bottomAnchor),
                hosting.view.leadingAnchor.constraint(equalTo: self.leadingAnchor),
                hosting.view.trailingAnchor.constraint(equalTo: self.trailingAnchor)
            ])
    
            self.hostingController = hosting
        }
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        
        if #available(iOS 16.0, *) {
            guard let hosting = hostingController else { return }
            if window != nil {
                if let parentVC = self.parentViewController, hosting.parent == nil {
                    if hosting.parent == nil {
                        parentVC.addChild(hosting)
                        hosting.didMove(toParent: parentVC)
                    }
                }
            } else {
                if hosting.parent != nil {
                    hosting.willMove(toParent: nil)
                    hosting.removeFromParent()
                }
            }
        }
    }
}

fileprivate extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder?.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }
}