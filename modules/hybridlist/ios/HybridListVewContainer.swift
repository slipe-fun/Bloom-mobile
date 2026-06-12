import ExpoModulesCore
import SwiftUI

class HybridListViewContainer: ExpoView {
    var data: [ListItemRecord] = [] {
        didSet { updateView() }
    }
    
    var theme: ListThemeRecord? {
        didSet { updateView() }
    }

     var contentInsetTop: Double = 0 {
        didSet { updateView() }
    }
    
     var contentInsetBottom: Double = 0 {
        didSet { updateView() }
    }
    
    let onItemPress = EventDispatcher()

    private var hostingController: UIHostingController<AnyView>?

    private func updateView() {
        guard let theme = theme else { return }
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            if #available(iOS 16.0, *) {
                let swiftUIView = SwiftUIList(data: self.data, theme: theme, contentInsetTop: self.contentInsetTop, contentInsetBottom: self.contentInsetBottom) { index, item in
                    self.onItemPress([
                        "index": index,
                        "item": [
                            "id": item.id,
                            "content": item.content,
                            "seen": item.seen,
                            "date": item.date,
                            "me": item.me,
                        ]
                    ])
                }
                
                let erasedView = AnyView(swiftUIView)
                
                if self.hostingController == nil {
                    let hosting = UIHostingController(rootView: erasedView)
                    hosting.view.backgroundColor = .clear
                    hosting.view.translatesAutoresizingMaskIntoConstraints = false
                    
                    self.addSubview(hosting.view)
                    
                    NSLayoutConstraint.activate([
                        hosting.view.topAnchor.constraint(equalTo: self.topAnchor),
                        hosting.view.bottomAnchor.constraint(equalTo: self.bottomAnchor),
                        hosting.view.leadingAnchor.constraint(equalTo: self.leadingAnchor),
                        hosting.view.trailingAnchor.constraint(equalTo: self.trailingAnchor)
                    ])
                    self.hostingController = hosting
                } else {
                    self.hostingController?.rootView = erasedView
                }
            }
        }
    }
}
