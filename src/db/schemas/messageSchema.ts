import { tableSchema } from '@nozbe/watermelondb'

export const messageSchema = tableSchema({
  name: 'messages',
  columns: [
    { name: 'server_id', type: 'number', isIndexed: true },
    { name: 'chat_id', type: 'number', isIndexed: true },
    { name: 'content', type: 'string' },
    { name: 'author_id', type: 'string', isIndexed: true },
    { name: 'date', type: 'number', isIndexed: true },
    { name: 'seen', type: 'number', isOptional: true },
    { name: 'nonce', type: 'string', isOptional: true },
    { name: 'reply_to_id', type: 'string', isOptional: true },
  ],
})
