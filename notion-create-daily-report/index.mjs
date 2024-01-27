import * as dotenv from 'dotenv'
import { getNotionClient, getBlockChildren, createDailyPage, deleteBlockChildren, createSection, queryTodayDailyPage, appendBlockChildren } from './notion.mjs';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const calendarDatabaseId = process.env.NOTION_CALENDAR_DATABASE_ID;
const worklogBlockId = process.env.NOTION_WORKLOG_BLOCK_ID;
const diaryBlockId = process.env.NOTION_DIARY_BLOCK_ID;
const client = getNotionClient(notionApiKey);

const dailyPage = await queryTodayDailyPage(client, calendarDatabaseId);
const res = await getBlockChildren(client, dailyPage[0].id); // 1日に複数の日報は作らない

const findHeadingIdByTitle = (blocks, title) => blocks
    .filter(({heading_3}) => heading_3)
    .find(({heading_3}) => heading_3.rich_text[0].plain_text === title)
    .id;

const worklogSectionHeadingId = findHeadingIdByTitle(res, '◻️ W O R K L O G');
const diarySectionHeadingId = findHeadingIdByTitle(res, '◻️ D I A R Y');

// Dashboardから日報の子要素を取得
const worklogBlockChildren = (await getBlockChildren(client, worklogBlockId))
  .filter(({toggle}) => toggle)
  .map(({ object, type, toggle }) => ({ object, type, toggle }));
const diaryBlockChildren = (await getBlockChildren(client, diaryBlockId))
  .filter(({paragraph}) => paragraph)
  .map(({ object, type, paragraph }) => ({ object, type, paragraph }));

// diaryページのセクションにブロックを追加
await appendBlockChildren(client, dailyPage[0].id, worklogSectionHeadingId, worklogBlockChildren);
await appendBlockChildren(client, dailyPage[0].id, diarySectionHeadingId, diaryBlockChildren);

// Dashboardの掃除
await deleteBlockChildren(client, worklogBlockId, 'toggle');
await deleteBlockChildren(client, diaryBlockId, 'paragraph');
