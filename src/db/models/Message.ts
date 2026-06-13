import { Model } from '@nozbe/watermelondb'
import { date, field, relation } from '@nozbe/watermelondb/decorators'

export class Message extends Model {
  static table = 'messages'

  @field('server_id')
  serverId!: number

  @field('chat_id')
  chatId!: number

  @field('content')
  content!: string

  @field('author_id')
  authorId!: string

  @date('date')
  date!: Date

  @date('seen')
  seen?: Date

  @field('nonce')
  nonce?: string

  @relation('messages', 'reply_to_id')
  replyTo?: Message
}
