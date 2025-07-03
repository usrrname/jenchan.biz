import rss from './rss.mjs'

async function postbuild() {
  console.log('🚀 Starting postbuild process...')

  try {
    console.log('📡 Generating RSS feed...')
    await rss()
    console.log('✅ RSS feed generated successfully!')
  } catch (error) {
    console.error('❌ Postbuild failed:', error)
    process.exit(1)
  }

  console.log('🎉 Postbuild completed successfully!')
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  postbuild()
}

export default postbuild
