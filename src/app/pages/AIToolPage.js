import React, { useState } from 'react'
import './styles/AIToolPage.css'
import { useParams } from "react-router-dom"
import { useAITool } from "app/hooks/aitoolsHooks"
import AILoader from "app/components/ui/AILoader"
import { convertClassicDate } from "app/utils/dateUtils"
import { beautifyUrl } from "app/utils/generalUtils"
import PhotoModal from "app/components/ui/PhotoModal"

export default function AIToolPage() {

  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null)
  const toolID = useParams().toolID
  const aitool = useAITool(toolID, setLoading)
  const allImages = aitool ? [aitool?.mainImg, ...aitool?.images] : []

  const imgsList = allImages?.map((img, index) => {
    return <img
      key={index}
      src={img}
      alt={`img-${index}`}
      onClick={() => setSelectedImg(img)}
    />
  })

  return !loading ? (
    <div className="aitool-page">
      <div className="tool-container">
        <div
          className="tool-header"
          style={{ backgroundImage: `url(${aitool.mainImg})` }}
        />
        <div className="tool-content">
          <div className="row">
            <div className="row-item">
              <img
                src={aitool.logo}
                alt="logo"
                className="logo"
              />
              <h1>{aitool.title}</h1>
            </div>
            <div className="colors">
              <div
                className="color-item"
                style={{ backgroundColor: aitool.color1 }}
              />
              <div
                className="color-item"
                style={{ backgroundColor: aitool.color2 }}
              />
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h5>{aitool.tagline}</h5>
            </div>
            <div className="row-item">
              <h6>Description</h6>
              <p>{aitool.shortDescription}</p>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>Category</h6>
              <p className="cap">{aitool.category}</p>
            </div>
            <div className="row-item">
              <h6>Website URL</h6>
              <a
                href={aitool.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="far fa-external-link" />
                {beautifyUrl(aitool.url)}
              </a>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>Type</h6>
              <p className="cap">{aitool.type}</p>
            </div>
            <div className="row-item">
              <h6>Tags</h6>
              <p>{aitool.tags.join(', ')}</p>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>Date Added</h6>
              <p>{convertClassicDate(aitool.dateAdded.toDate())}</p>
            </div>
            <div className="row-item">
              <h6>Date Created</h6>
              <p>{convertClassicDate(aitool.dateCreated.toDate())}</p>
            </div>
          </div>
          <div className="imgs-flex">
            <h4>Images</h4>
            {imgsList}
          </div>
        </div>
      </div>
      <PhotoModal
        img={selectedImg}
        onClose={() => setSelectedImg(null)}
        showModal={selectedImg !== null}
      />
    </div>
  ) :
    <div className="aitool-page loading">
      <AILoader />
    </div>
}
