import { Client } from '@notionhq/client';

const createHeading = (title) => {
  return {
      object: 'block',
      type: 'heading_3',
      heading_3: {
        is_toggleable: false,
        color: 'gray_background',
        rich_text: [
          {
            type: 'text',
            text: { content: title, link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: title,
            href: null
          }
        ],
    },
  }
}
export const createSection = (title, children) => {
  return [
    createHeading(title),
    ...children,
  ]
}

export const getNotionClient = (auth) => {
  return new Client({ auth });
}

export const getBlockChildren = async (client, blockId) => {
  const block = await client.blocks.children.list({
    block_id: blockId,
  })

  return block.results
}
export const createDailyPage = async (client, databaseId, children) => {
  // yyyy-mm-dd形式で日付文字列を取得
  const localToday = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"}
  ).replaceAll('/', '-')

  await client.pages.create({
    parent: { database_id: databaseId },
    properties: {
      名前: {
        type: 'title',
        title: [{ text: { content: localToday } }],
      },
      日付: {
        "date": {
            "start": localToday,
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

export const getBlock = async (client, blockId) => {
  const block = await client.blocks.retrieve({ block_id: blockId });
  return block;
}
export const getPage = async (client, pageId) => {
  const page = await client.pages.retrieve({ page_id: pageId });
  return page;
}