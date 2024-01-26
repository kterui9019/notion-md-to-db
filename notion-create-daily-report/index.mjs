import * as dotenv from 'dotenv'
import { getNotionClient, getBlockChildren, createDailyPage, deleteBlockChildren, createSection } from './notion.mjs';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const calendarDatabaseId = process.env.NOTION_CALENDAR_DATABASE_ID;
const worklogBlockId = process.env.NOTION_WORKLOG_BLOCK_ID;
const diaryBlockId = process.env.NOTION_DIARY_BLOCK_ID;
const client = getNotionClient(notionApiKey);

// HOMEから日報の子要素を取得
const worklogChildren = await getBlockChildren(client, worklogBlockId);
const worklogSection = createSection(
  '◻️ W O R K L O G',
  worklogChildren
    .filter(({toggle}) => toggle)
    .map(({ object, type, toggle }) => ({ object, type, toggle }))
);

// HOMEから日記の子要素を取得
const diaryBlockChildren = await getBlockChildren(client, diaryBlockId);
const diarySection = createSection(
  '◻️ D I A R Y',
  diaryBlockChildren
    .filter(({paragraph}) => paragraph)
    .map(({ object, type, paragraph }) => ({ object, type, paragraph }))
);

// カレンダーデータベースに日報を作成
await createDailyPage(client, calendarDatabaseId, [...worklogSection, ...diarySection]);

// HOMEの日報の子要素を全て削除
await deleteBlockChildren(client, worklogBlockId, 'toggle');

// HOMEの日記の子要素を全て削除
await deleteBlockChildren(client, diaryBlockId, 'paragraph');