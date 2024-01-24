import { Client } from '@notionhq/client';

export const getNotionClient = (auth) => {
  return new Client({ auth });
}

export const createPage = async (client, notes, databaseId) => {
  const failedNotes = []

  for (const note of notes) {
    try {
      console.log(note)
      await client.pages.create({
        parent: { database_id: databaseId },
        // 各ノート（ページ）のプロパティ
        properties: {
          // プロパティ名はcase sensitiveっぽいので注意
          名前: {
            type: 'title',
            title: [{ text: { content: note.name } }],
          },
        },
        // ページの中身
        children: note.body,
      })
    } catch (e) {
      console.error(`${note.name}の追加に失敗: `, e)
      failedNotes.push(note.name)
    }
  }

  console.log('ページ作成に失敗したノート: ', failedNotes)
}