/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ShowsImport } from './routes/shows'
import { Route as IndexImport } from './routes/index'
import { Route as ShowsIdImport } from './routes/shows.$id'
import { Route as PeopleIdImport } from './routes/people.$id'
import { Route as FilmsIdImport } from './routes/films.$id'

// Create/Update Routes

const ShowsRoute = ShowsImport.update({
  path: '/shows',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ShowsIdRoute = ShowsIdImport.update({
  path: '/$id',
  getParentRoute: () => ShowsRoute,
} as any)

const PeopleIdRoute = PeopleIdImport.update({
  path: '/people/$id',
  getParentRoute: () => rootRoute,
} as any)

const FilmsIdRoute = FilmsIdImport.update({
  path: '/films/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/shows': {
      preLoaderRoute: typeof ShowsImport
      parentRoute: typeof rootRoute
    }
    '/films/$id': {
      preLoaderRoute: typeof FilmsIdImport
      parentRoute: typeof rootRoute
    }
    '/people/$id': {
      preLoaderRoute: typeof PeopleIdImport
      parentRoute: typeof rootRoute
    }
    '/shows/$id': {
      preLoaderRoute: typeof ShowsIdImport
      parentRoute: typeof ShowsImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  ShowsRoute.addChildren([ShowsIdRoute]),
  FilmsIdRoute,
  PeopleIdRoute,
])

/* prettier-ignore-end */