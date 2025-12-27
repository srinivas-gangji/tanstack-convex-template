import ReactDOM from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { getRouter } from './router'
import './index.css'

const router = getRouter()

ReactDOM.hydrateRoot(document, <StartClient router={router} />)
