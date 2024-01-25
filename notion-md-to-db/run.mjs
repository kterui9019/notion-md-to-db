import * as dotenv from 'dotenv'
import { getAllNotes } from './input.mjs';
import { getNotionClient, createPage } from './output.mjs';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const mdDirPath = process.env.MD_DIR_PATH;
const toDatabaseId = process.env.NOTION_TO_DATABASE_ID;

const notes = getAllNotes(mdDirPath);

await createPage(getNotionClient(notionApiKey), notes, toDatabaseId)
