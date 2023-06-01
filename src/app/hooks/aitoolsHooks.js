import {
  getAITool, getAIToolPreview, getAITools, getAllTools,
  getChatPrompt, getChatPrompts, getNonAITools,
  getPromptPreview,
  getPromptsByCategory, getPromptsSubmissionsByStatus, getToolsByPopularityAndType, getToolsByType,
  getToolsByTypeAndCategory,
  getToolsSubmissionsByTypeAndStatus,
  getUserPromptsSubmissionsDocsCountByStatus,
  getUserToolsSubmissionsDocsCountByStatusAndType
} from "app/services/aitoolsServices"
import { StoreContext } from "app/store/store"
import { useContext, useEffect, useState } from "react"

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
    getAllTools(limit)
      .then((tools) => {
        setLoading(false)
        setTools(tools)
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
    if (type === 'all') {
      getAllTools(limit)
        .then((tools) => {
          setTools(tools)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
    else {
      getToolsByType(type, limit)
        .then((tools) => {
          setLoading(false)
          setTools(tools)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
  }, [type, limit])

  return tools
}

export const useToolsByTypeAndCategory = (type, category, limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    getToolsByTypeAndCategory(type, category, limit)
      .then((tools) => {
        setTools(tools)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [type, category, limit])

  return tools
}

export const useToolsByPopularityAndType = (type, category, viewsNum, ratingNum, limit, setLoading) => {
  const [tools, setTools] = useState([])

  useEffect(() => {
    getToolsByPopularityAndType(type, category, viewsNum, ratingNum, limit)
      .then((tools) => {
        setTools(tools)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [type, category, viewsNum, ratingNum, limit])

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

export const useAIToolPreview = (toolID, setLoading) => {

  const [tool, setTool] = useState(null)

  useEffect(() => {
    if (!toolID) return
    getAIToolPreview(toolID)
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

export const usePromptPreview = (promptID, setLoading) => {

  const [prompt, setPrompt] = useState(null)

  useEffect(() => {
    if (!promptID) return
    getPromptPreview(promptID)
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



// pro user submissions
export const useAIToolsSubmissionsByTypeAndStatus = (type, status, limit, setLoading) => {

  const { myUserID } = useContext(StoreContext)
  const [tools, setTools] = useState([])

  useEffect(() => {
    getToolsSubmissionsByTypeAndStatus(myUserID, type, status, limit)
      .then((data) => {
        setLoading(false)
        setTools(data)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [myUserID, type, status, limit])

  return tools
}

export const useUserToolsSubmissionsDocsCountByStatusAndType = (path, type, status) => {

  const { myUserID } = useContext(StoreContext)
  const [count, setCount] = useState(0)

  useEffect(() => {
    getUserToolsSubmissionsDocsCountByStatusAndType(myUserID, path, type, status)
      .then((count) => { 
        setCount(count)
      })
      .catch((err) => console.log(err))
  }, [myUserID, path, type, status])

  return count
}

export const usePromptsSubmissionsByStatus = (status, limit, setLoading) => {

  const { myUserID } = useContext(StoreContext)
  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    getPromptsSubmissionsByStatus(myUserID, status, limit)
      .then((data) => {
        setLoading(false)
        setPrompts(data)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [myUserID, status, limit])

  return prompts
}

export const useUserPromptsSubmissionsDocsCountByStatus = (path, status) => {

  const { myUserID } = useContext(StoreContext)
  const [count, setCount] = useState(0)

  useEffect(() => {
    getUserPromptsSubmissionsDocsCountByStatus(myUserID, path, status)
      .then((count) => {
        setCount(count)
      })
      .catch((err) => console.log(err))
  }, [myUserID, path, status])

  return count
}