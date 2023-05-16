import { detectAndUnderlineAllLinksInText } from "app/utils/generalUtils"
import React from 'react'

export default function AppLink({text}) {
  return (
    <span dangerouslySetInnerHTML={{ __html: detectAndUnderlineAllLinksInText(text) }} />
  )
}
