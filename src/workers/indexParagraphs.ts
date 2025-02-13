import { Worker, Job } from 'bullmq'
import redis from '../config/redis'
import { ChromaClient } from 'chromadb'
import { OpenAIEmbeddingFunction } from 'chromadb'
import { indexParagraphs, searchVectors } from '../queues'
import { cleanCollectionName } from '../lib/cleaners'
import chromadb from '../config/chromadb'
import openai from '../config/openai'

class JobData extends Job {
  data: {
    paragraphs: string[]
    url: string
  }
}

const worker = new Worker(
  'indexParagraphs',
  async (job: JobData) => {
    const client = new ChromaClient(chromadb)

    const paragraphs = job.data.paragraphs
    const url = job.data.url
    job.log('Indexing ' + paragraphs.length + ' paragraphs from url: ' + url)
    const embedder = new OpenAIEmbeddingFunction(openai)

    const collection = await client.getOrCreateCollection({
      name: cleanCollectionName(url),
      embeddingFunction: embedder,
    })

    await Promise.all(
      paragraphs.map(async (p, i) => {
        job.log('Adding paragraph ' + i)
        await collection.add({
          ids: [job.data.url + '#' + i],
          metadatas: [
            {
              source: url,
              parsed: new Date().toISOString(),
              page: i,
            },
          ],
          documents: [p],
        })
        job.updateProgress(Math.floor(Math.min(1, i / paragraphs.length) * 100))
      })
    )

    // await collection.add({
    //   ids: paragraphs.map((p, i) => job.data.url + '#' + i),
    //   metadatas: paragraphs.map((p, i) => ({
    //     source: url,
    //     parsed: new Date().toISOString(),
    //     page: i,
    //   })),
    //   documents: paragraphs.map((p) => p),
    // })

    searchVectors.add('search ' + url, {
      url,
    })

    return paragraphs
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
