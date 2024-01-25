import { Client } from '@notionhq/client';

export const getNotionClient = (auth) => {
  return new Client({ auth });
}

export const getBlockChildren = async (client, blockId) => {
  const block = await client.blocks.children.list({
    block_id: blockId,
  })

  return block.results
}
export const createPage = async (client, databaseId, dateJst, children) => {
  // yyyy.mm.dd形式で日付文字列を取得
  const titleDateString = new Date(dateJst).toISOString().split('T')[0].replace(/-/g, '.');
  // yyyy-mm-dd形式で日付文字列を取得
  const propertyDateString = new Date(dateJst).toISOString().split('T')[0];

  await client.pages.create({
    parent: { database_id: databaseId },
    properties: {
      名前: {
        type: 'title',
        title: [{ text: { content: titleDateString } }],
      },
      日付: {
        "date": {
            "start": propertyDateString,
            "end": null,
            "time_zone": null
        }
      }
    },
    children,
  })

}

// 指定されたブロックIDの子要素を全て削除する
export const deleteBlockChildren = async (client, blockId) => {
  const children = await client.blocks.children.list({
    block_id: blockId,
  })

  const childrenIds = children.results
    .filter(({type}) => type === 'toggle')
    .map(({ id }) => id);

  for (const id of childrenIds) {
    const res = await client.blocks.delete({block_id: id})
  }
}