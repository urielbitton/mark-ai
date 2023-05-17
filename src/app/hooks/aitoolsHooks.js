import { getAITools } from "app/services/aitoolsServices"
import { useEffect, useState } from "react"

export const useAiTools = (limit) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    getAITools(setTools, limit)
  },[limit])

  return tools
}