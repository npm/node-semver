/* eslint-disable no-console */
import { type SuiteReport } from '@pawel-up/benchmark'
import { readdir, readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const historyPath = './benchmarks/history'

export type HistoryType = 'compare' | 'diff' | 'parse-options' | 'subset' | 'parse' | 'satisfied'

export function getHistoryPath(type: HistoryType): string {
  return `${historyPath}/${type}`
}

export async function listHistoryFiles(type: HistoryType): Promise<string[]> {
  const path = getHistoryPath(type)
  await mkdir(path, { recursive: true })
  const files = await readdir(getHistoryPath(type))
  const filteredFiles = files.filter((file) => file.endsWith(`_benchmark.json`))
  return filteredFiles.sort()
}

export async function getLatestBenchmark(type: HistoryType): Promise<SuiteReport | undefined> {
  const files = await listHistoryFiles(type)
  const file = files.pop()
  if (!file) {
    return
  }
  try {
    const data = await readFile(path.join(getHistoryPath(type), file), 'utf-8')
    const result = JSON.parse(data)
    return result
  } catch (error) {
    console.error('Error reading benchmark file:', error)
  }
}
