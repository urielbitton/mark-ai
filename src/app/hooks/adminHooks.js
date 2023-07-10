import {
  getGuestToolsSubmissionsByStatus,
  getGuestToolsSubmissionsCountByStatus,
  getPromptSubmissionByID,
  getPromptsSubmissionsByStatus, getPromptsSubmissionsCountByStatus,
  getToolSubmissionByID,
  getToolsSubmissionsByStatus, getToolsSubmissionsDocCountByStatus
} from "app/services/adminServices"
import { useEffect, useState } from "react"

export const useToolSubmission = (toolID, setLoading) => {

  const [tool, setTool] = useState(null)

  useEffect(() => {
    getToolSubmissionByID(toolID)
      .then((tool) => {
        setTool(tool)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [toolID])

  return tool
}

export const usePromptSubmission = (promptID, setLoading) => {

  const [prompt, setPrompt] = useState(null)

  useEffect(() => {
    getPromptSubmissionByID(promptID)
      .then((prompt) => {
        setPrompt(prompt)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [promptID])  

  return prompt
}

export const useToolsSubmissionsByStatus = (status, limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    setLoading(true)
    getToolsSubmissionsByStatus(status, limit)
      .then((tools) => {
        setTools(tools)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [status, limit])

  return tools
}

export const useToolsSubmissionsCountByStatus = (status) => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    getToolsSubmissionsDocCountByStatus(status)
      .then((count) => {
        setCount(count)
      })
      .catch(err => {
        console.log(err)
      })
  }, [status])

  return count
}

export const usePromptsSubmissionsByStatus = (status, limit, setLoading) => {

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    setLoading(true)
    getPromptsSubmissionsByStatus(status, limit)
      .then((prompts) => {
        setPrompts(prompts)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [status, limit])

  return prompts
}

export const usePromptsSubmissionsCountByStatus = (status) => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    getPromptsSubmissionsCountByStatus(status)
      .then((count) => {
        setCount(count)
      })
      .catch(err => {
        console.log(err)
      })
  }, [status])

  return count
}

export const useGuestToolsSubmissionsByStatus = (status, limit, setLoading) => {

  const [tools, setTools] = useState([])

  useEffect(() => {
    setLoading(true)
    getGuestToolsSubmissionsByStatus(status, limit)
      .then((tools) => {
        setTools(tools)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [status, limit])

  return tools
}

export const useGuestToolsSubmissionsCountByStatus = (status) => {
  
    const [count, setCount] = useState(0)
  
    useEffect(() => {
      getGuestToolsSubmissionsCountByStatus(status)
        .then((count) => {
          setCount(count)
        })
        .catch(err => {
          console.log(err)
        })
    }, [status])
  
    return count
  }