import * as dotenv from 'dotenv'
import { getNotionClient, getBlockChildren, createPage, deleteBlockChildren } from './notion.mjs';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const calendarDatabaseId = process.env.NOTION_CALENDAR_DATABASE_ID;
const targetBlockId = process.env.NOTION_TARGET_BLOCK_ID;
const japanStandardTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
const client = getNotionClient(notionApiKey);

// HOMEから日報の子要素を取得
const children = await getBlockChildren(client, targetBlockId);

// childrenのオブジェクトからキー'object', 'type', 'toggle'を抽出してpageAttributeに格納(それ以外のプロパティは使わない)
const pageChildren = children
  .filter(({toggle}) => toggle)
  .map(({ object, type, toggle }) => ({ object, type, toggle }));

// カレンダーデータベースに日報を作成
await createPage(client, calendarDatabaseId, japanStandardTime, pageChildren);

// HOMEの日報の子要素を全て削除
await deleteBlockChildren(client, targetBlockId);