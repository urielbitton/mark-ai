import { getAITool, getAITools, getAllTools, getChatPrompt, getChatPrompts, getNonAITools, getPromptsByCategory, getToolsByType } from "app/services/aitoolsServices"
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
  }, [limit])

  return tools
}

export const useAITool = (toolID, setLoading) => {

  const [tool, setTool] = useState(null)

  useEffect(() => {
    if (!toolID) return
    getAITool(toolID)
      .then((tool) => {
        setLoading(false)
        setTool(tool)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [toolID])

  return tool
}

export const useNonAITools = (limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    getNonAITools(setTools, limit)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [limit])

  return tools
}

export const useAllTools = (limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    getAllTools(setTools, limit)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [limit])

  return tools
}

export const useToolsByType = (type, limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    getToolsByType(type, setTools, limit)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [type, limit])

  return tools
}


export const useChatPrompts = (limit, setLoading) => {

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    getChatPrompts(setPrompts, limit)
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [limit])

  return prompts
}

export const useChatPrompt = (promptID, setLoading) => {

  const [prompt, setPrompt] = useState(null)

  useEffect(() => {
    if (!promptID) return
    getChatPrompt(promptID)
      .then((prompt) => {
        setLoading(false)
        setPrompt(prompt)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [promptID])

  return prompt
}

export const usePromptsByCategory = (category, limit, setLoading) => {

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    getPromptsByCategory(category, limit)
      .then((data) => {
        setPrompts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [category, limit])

  return prompts
}