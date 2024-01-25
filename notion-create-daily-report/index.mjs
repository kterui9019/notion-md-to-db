import * as dotenv from 'dotenv'
import { getNotionClient, getBlockChildren, createDailyPage, deleteBlockChildren, createSection } from './notion.mjs';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const calendarDatabaseId = process.env.NOTION_CALENDAR_DATABASE_ID;
const targetBlockId = process.env.NOTION_TARGET_BLOCK_ID;
const client = getNotionClient(notionApiKey);

// HOMEから日報の子要素を取得
const children = await getBlockChildren(client, targetBlockId);

// childrenのオブジェクトからキー'object', 'type', 'toggle'を抽出してpageAttributeに格納(それ以外のプロパティは使わない)
const worklogSectionChildren = children
  .filter(({toggle}) => toggle)
  .map(({ object, type, toggle }) => ({ object, type, toggle }));

// カレンダーデータベースに日報を作成
await createDailyPage(client, calendarDatabaseId, createSection('◻️ W O R K L O G', worklogSectionChildren));

// HOMEの日報の子要素を全て削除
await deleteBlockChildren(client, targetBlockId);