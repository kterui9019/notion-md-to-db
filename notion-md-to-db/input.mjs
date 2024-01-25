import { readFileSync, readdirSync } from 'fs'
import matter from 'gray-matter'
import * as path from 'path';
import { markdownToBlocks } from '@tryfabric/martian'

export const getAllNotes = (targetDirPath) => {
  const fileNames = readdirSync(targetDirPath)

  const notes = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      console.log(name)
      const content = readFileSync(path.join(targetDirPath, name))
      const matterResult = matter(content)

      return {
        // Notionのページのタイトルになる
        name: name.replace(/.md$/, ''),
        // NotionのページのTagsになる
        tags: matterResult.data.tags,
        // Notionのページの中身になる
        body: markdownToBlocks(matterResult.content),
      }
    })

  return notes
}
