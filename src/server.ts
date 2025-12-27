import { createServerHandler } from '@tanstack/react-start/server'
import { getRouter } from './router'

export default createServerHandler({
  createRouter: getRouter,
})
