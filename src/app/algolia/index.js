import algoliasearch from "algoliasearch"

const algolia_app_id = process.env.REACT_APP_ALGOLIA_APP_ID
const algolia_admin_key = process.env.REACT_APP_ALGOLIA_ADMIN_KEY

export const algoliaSearchClient = algoliasearch(
  algolia_app_id,
  algolia_admin_key
)

export const aitoolsIndex = algoliaSearchClient.initIndex('aitools_index')
export const promptsIndex = algoliaSearchClient.initIndex('prompts_index')
