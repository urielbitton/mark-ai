import { getAITool, getAITools } from "app/services/aitoolsServices"
import { useEffect, useState } from "react"

export const useAiTools = (limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    getAITools(setTools, limit)
    .then(() => {
      setLoading(false)
    })
    .catch((err) => {
      console.log(err)
      setLoading(false)
    })
  },[limit])

  return tools
}

export const useAITool = (toolID, setLoading) => {

  const [tool, setTool] = useState(null)

  useEffect(() => {
    if(!toolID) return
    getAITool(toolID)
    .then((tool) => {
      setLoading(false)
      setTool(tool)
    })
    .catch((err) => {
      console.log(err)
      setLoading(false)
    })
  },[toolID])

  return tool
}