import React from 'react'
import errorBoundaryImg from 'app/assets/images/error-boundary.png'

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <img src={errorBoundaryImg} alt=""/>
          <h1>An error occured on this page</h1>
          <h6>Don't worry we're working on fixing this bug so it doesn't happen again.</h6>
          <a href="https://markai.pro">
            <button>
              <i className="fal fa-home" />
              Back Home
            </button>
          </a>
        </div>
      )
    }
    return this.props.children; 
  }
}

export default ErrorBoundary