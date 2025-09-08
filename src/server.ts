import { buildApp } from './app'
import dotenv from 'dotenv'
dotenv.config()

const start = async () => {
  const app = await buildApp()
  try {
    await app.listen({ port: Number(process.env.PORT) || 4000 })
    console.log(`🚀 Server running on port ${process.env.PORT || 4000}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
