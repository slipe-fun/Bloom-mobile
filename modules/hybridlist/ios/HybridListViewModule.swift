import ExpoModulesCore
import SwiftUI

struct ListItemRecord: Record {
  @Field var id: Int
  @Field var content: String
  @Field var seen: String? = nil
  @Field var date: String
  @Field var me: Bool
  @Field var nonce: String
  @Field var chatId: Int
  @Field var authorId: String
  @Field var groupEnd: Bool
  @Field var groupStart: Bool
}

struct ListThemeRecord: Record {
  @Field var backgroundColor: String
  @Field var textColor: String
  @Field var secondaryTextColor: String
  @Field var primaryColor: String
  @Field var whiteColor: String
  @Field var foregroundColor: String
}

extension ListItemRecord: Equatable {
    public static func == (lhs: ListItemRecord, rhs: ListItemRecord) -> Bool {
        lhs.id == rhs.id && 
        lhs.seen == rhs.seen && 
        lhs.content == rhs.content
    }
}

public class HybridListViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("HybridListView")

    View(HybridListViewContainer.self) {
      Prop("data") { (view: HybridListViewContainer, data: [ListItemRecord]) in
        view.data = data
      }
      Prop("theme") { (view: HybridListViewContainer, theme: ListThemeRecord) in
        view.theme = theme
      }
      Prop("contentInsetTop") { (view: HybridListViewContainer, prop: Double) in
        view.contentInsetTop = prop
      }
      Prop("lastSeenId") { (view: HybridListViewContainer, prop: Int) in
        view.lastSeenId = prop
      }
      Prop("contentInsetBottom") { (view: HybridListViewContainer, prop: Double) in
        view.contentInsetBottom = prop
      }
      
      Events("onItemPress")
    }
  }
}