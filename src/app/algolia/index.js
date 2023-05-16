import algoliasearch from "algoliasearch"

const algolia_app_id = process.env.REACT_APP_ALGOLIA_APP_ID
const algolia_admin_key = process.env.REACT_APP_ALGOLIA_ADMIN_KEY

export const algoliaSearchClient = algoliasearch(
  algolia_app_id,
  algolia_admin_key
)

export const usersIndex = algoliaSearchClient.initIndex('users_index')
export const projectsIndex = algoliaSearchClient.initIndex('projects_index')

export const tasksIndex = algoliaSearchClient.initIndex('tasks_index')
export const tasksAscIndex = algoliaSearchClient.initIndex('tasks_date_asc')
export const tasksPointsDescIndex = algoliaSearchClient.initIndex('tasks_points_desc')
export const tasksPointsAscIndex = algoliaSearchClient.initIndex('tasks_points_asc')
export const tasksTypeDescIndex = algoliaSearchClient.initIndex('tasks_type_desc')
export const tasksPriorityDescIndex = algoliaSearchClient.initIndex('tasks_priority_desc')
export const tasksPriorityAscIndex = algoliaSearchClient.initIndex('tasks_priority_asc')
export const tasksStatusDescIndex = algoliaSearchClient.initIndex('tasks_status_desc')
export const tasksTitleDescIndex = algoliaSearchClient.initIndex('tasks_title_desc')
export const tasksTitleAscIndex = algoliaSearchClient.initIndex('tasks_title_asc')

export const projectPagesIndex = algoliaSearchClient.initIndex('project_pages_index')