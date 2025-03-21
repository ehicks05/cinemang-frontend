/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PathlessLayoutImport } from './routes/_pathlessLayout'
import { Route as IndexImport } from './routes/index'
import { Route as TvIndexImport } from './routes/tv.index'
import { Route as TanRoutesIndexImport } from './routes/tan-routes/index'
import { Route as FilmsIndexImport } from './routes/films.index'
import { Route as TvShowIdImport } from './routes/tv.$showId'
import { Route as TanRoutesRedirectImport } from './routes/tan-routes/redirect'
import { Route as TanRoutesDeferredImport } from './routes/tan-routes/deferred'
import { Route as PeoplePersonIdImport } from './routes/people.$personId'
import { Route as FilmsFilmIdImport } from './routes/films.$filmId'
import { Route as PathlessLayoutNestedLayoutImport } from './routes/_pathlessLayout/_nested-layout'
import { Route as TanRoutesUsersRouteImport } from './routes/tan-routes/users.route'
import { Route as TanRoutesPostsRouteImport } from './routes/tan-routes/posts.route'
import { Route as TanRoutesUsersIndexImport } from './routes/tan-routes/users.index'
import { Route as TanRoutesPostsIndexImport } from './routes/tan-routes/posts.index'
import { Route as TanRoutesUsersUserIdImport } from './routes/tan-routes/users.$userId'
import { Route as TanRoutesPostsPostIdImport } from './routes/tan-routes/posts.$postId'
import { Route as PathlessLayoutNestedLayoutRouteBImport } from './routes/_pathlessLayout/_nested-layout/route-b'
import { Route as PathlessLayoutNestedLayoutRouteAImport } from './routes/_pathlessLayout/_nested-layout/route-a'
import { Route as TanRoutesPostsPostIdDeepImport } from './routes/tan-routes/posts_.$postId.deep'

// Create/Update Routes

const PathlessLayoutRoute = PathlessLayoutImport.update({
  id: '/_pathlessLayout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TvIndexRoute = TvIndexImport.update({
  id: '/tv/',
  path: '/tv/',
  getParentRoute: () => rootRoute,
} as any)

const TanRoutesIndexRoute = TanRoutesIndexImport.update({
  id: '/tan-routes/',
  path: '/tan-routes/',
  getParentRoute: () => rootRoute,
} as any)

const FilmsIndexRoute = FilmsIndexImport.update({
  id: '/films/',
  path: '/films/',
  getParentRoute: () => rootRoute,
} as any)

const TvShowIdRoute = TvShowIdImport.update({
  id: '/tv/$showId',
  path: '/tv/$showId',
  getParentRoute: () => rootRoute,
} as any)

const TanRoutesRedirectRoute = TanRoutesRedirectImport.update({
  id: '/tan-routes/redirect',
  path: '/tan-routes/redirect',
  getParentRoute: () => rootRoute,
} as any)

const TanRoutesDeferredRoute = TanRoutesDeferredImport.update({
  id: '/tan-routes/deferred',
  path: '/tan-routes/deferred',
  getParentRoute: () => rootRoute,
} as any)

const PeoplePersonIdRoute = PeoplePersonIdImport.update({
  id: '/people/$personId',
  path: '/people/$personId',
  getParentRoute: () => rootRoute,
} as any)

const FilmsFilmIdRoute = FilmsFilmIdImport.update({
  id: '/films/$filmId',
  path: '/films/$filmId',
  getParentRoute: () => rootRoute,
} as any)

const PathlessLayoutNestedLayoutRoute = PathlessLayoutNestedLayoutImport.update(
  {
    id: '/_nested-layout',
    getParentRoute: () => PathlessLayoutRoute,
  } as any,
)

const TanRoutesUsersRouteRoute = TanRoutesUsersRouteImport.update({
  id: '/tan-routes/users',
  path: '/tan-routes/users',
  getParentRoute: () => rootRoute,
} as any)

const TanRoutesPostsRouteRoute = TanRoutesPostsRouteImport.update({
  id: '/tan-routes/posts',
  path: '/tan-routes/posts',
  getParentRoute: () => rootRoute,
} as any)

const TanRoutesUsersIndexRoute = TanRoutesUsersIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => TanRoutesUsersRouteRoute,
} as any)

const TanRoutesPostsIndexRoute = TanRoutesPostsIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => TanRoutesPostsRouteRoute,
} as any)

const TanRoutesUsersUserIdRoute = TanRoutesUsersUserIdImport.update({
  id: '/$userId',
  path: '/$userId',
  getParentRoute: () => TanRoutesUsersRouteRoute,
} as any)

const TanRoutesPostsPostIdRoute = TanRoutesPostsPostIdImport.update({
  id: '/$postId',
  path: '/$postId',
  getParentRoute: () => TanRoutesPostsRouteRoute,
} as any)

const PathlessLayoutNestedLayoutRouteBRoute =
  PathlessLayoutNestedLayoutRouteBImport.update({
    id: '/route-b',
    path: '/route-b',
    getParentRoute: () => PathlessLayoutNestedLayoutRoute,
  } as any)

const PathlessLayoutNestedLayoutRouteARoute =
  PathlessLayoutNestedLayoutRouteAImport.update({
    id: '/route-a',
    path: '/route-a',
    getParentRoute: () => PathlessLayoutNestedLayoutRoute,
  } as any)

const TanRoutesPostsPostIdDeepRoute = TanRoutesPostsPostIdDeepImport.update({
  id: '/tan-routes/posts_/$postId/deep',
  path: '/tan-routes/posts/$postId/deep',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_pathlessLayout': {
      id: '/_pathlessLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PathlessLayoutImport
      parentRoute: typeof rootRoute
    }
    '/tan-routes/posts': {
      id: '/tan-routes/posts'
      path: '/tan-routes/posts'
      fullPath: '/tan-routes/posts'
      preLoaderRoute: typeof TanRoutesPostsRouteImport
      parentRoute: typeof rootRoute
    }
    '/tan-routes/users': {
      id: '/tan-routes/users'
      path: '/tan-routes/users'
      fullPath: '/tan-routes/users'
      preLoaderRoute: typeof TanRoutesUsersRouteImport
      parentRoute: typeof rootRoute
    }
    '/_pathlessLayout/_nested-layout': {
      id: '/_pathlessLayout/_nested-layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PathlessLayoutNestedLayoutImport
      parentRoute: typeof PathlessLayoutImport
    }
    '/films/$filmId': {
      id: '/films/$filmId'
      path: '/films/$filmId'
      fullPath: '/films/$filmId'
      preLoaderRoute: typeof FilmsFilmIdImport
      parentRoute: typeof rootRoute
    }
    '/people/$personId': {
      id: '/people/$personId'
      path: '/people/$personId'
      fullPath: '/people/$personId'
      preLoaderRoute: typeof PeoplePersonIdImport
      parentRoute: typeof rootRoute
    }
    '/tan-routes/deferred': {
      id: '/tan-routes/deferred'
      path: '/tan-routes/deferred'
      fullPath: '/tan-routes/deferred'
      preLoaderRoute: typeof TanRoutesDeferredImport
      parentRoute: typeof rootRoute
    }
    '/tan-routes/redirect': {
      id: '/tan-routes/redirect'
      path: '/tan-routes/redirect'
      fullPath: '/tan-routes/redirect'
      preLoaderRoute: typeof TanRoutesRedirectImport
      parentRoute: typeof rootRoute
    }
    '/tv/$showId': {
      id: '/tv/$showId'
      path: '/tv/$showId'
      fullPath: '/tv/$showId'
      preLoaderRoute: typeof TvShowIdImport
      parentRoute: typeof rootRoute
    }
    '/films/': {
      id: '/films/'
      path: '/films'
      fullPath: '/films'
      preLoaderRoute: typeof FilmsIndexImport
      parentRoute: typeof rootRoute
    }
    '/tan-routes/': {
      id: '/tan-routes/'
      path: '/tan-routes'
      fullPath: '/tan-routes'
      preLoaderRoute: typeof TanRoutesIndexImport
      parentRoute: typeof rootRoute
    }
    '/tv/': {
      id: '/tv/'
      path: '/tv'
      fullPath: '/tv'
      preLoaderRoute: typeof TvIndexImport
      parentRoute: typeof rootRoute
    }
    '/_pathlessLayout/_nested-layout/route-a': {
      id: '/_pathlessLayout/_nested-layout/route-a'
      path: '/route-a'
      fullPath: '/route-a'
      preLoaderRoute: typeof PathlessLayoutNestedLayoutRouteAImport
      parentRoute: typeof PathlessLayoutNestedLayoutImport
    }
    '/_pathlessLayout/_nested-layout/route-b': {
      id: '/_pathlessLayout/_nested-layout/route-b'
      path: '/route-b'
      fullPath: '/route-b'
      preLoaderRoute: typeof PathlessLayoutNestedLayoutRouteBImport
      parentRoute: typeof PathlessLayoutNestedLayoutImport
    }
    '/tan-routes/posts/$postId': {
      id: '/tan-routes/posts/$postId'
      path: '/$postId'
      fullPath: '/tan-routes/posts/$postId'
      preLoaderRoute: typeof TanRoutesPostsPostIdImport
      parentRoute: typeof TanRoutesPostsRouteImport
    }
    '/tan-routes/users/$userId': {
      id: '/tan-routes/users/$userId'
      path: '/$userId'
      fullPath: '/tan-routes/users/$userId'
      preLoaderRoute: typeof TanRoutesUsersUserIdImport
      parentRoute: typeof TanRoutesUsersRouteImport
    }
    '/tan-routes/posts/': {
      id: '/tan-routes/posts/'
      path: '/'
      fullPath: '/tan-routes/posts/'
      preLoaderRoute: typeof TanRoutesPostsIndexImport
      parentRoute: typeof TanRoutesPostsRouteImport
    }
    '/tan-routes/users/': {
      id: '/tan-routes/users/'
      path: '/'
      fullPath: '/tan-routes/users/'
      preLoaderRoute: typeof TanRoutesUsersIndexImport
      parentRoute: typeof TanRoutesUsersRouteImport
    }
    '/tan-routes/posts_/$postId/deep': {
      id: '/tan-routes/posts_/$postId/deep'
      path: '/tan-routes/posts/$postId/deep'
      fullPath: '/tan-routes/posts/$postId/deep'
      preLoaderRoute: typeof TanRoutesPostsPostIdDeepImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface PathlessLayoutNestedLayoutRouteChildren {
  PathlessLayoutNestedLayoutRouteARoute: typeof PathlessLayoutNestedLayoutRouteARoute
  PathlessLayoutNestedLayoutRouteBRoute: typeof PathlessLayoutNestedLayoutRouteBRoute
}

const PathlessLayoutNestedLayoutRouteChildren: PathlessLayoutNestedLayoutRouteChildren =
  {
    PathlessLayoutNestedLayoutRouteARoute:
      PathlessLayoutNestedLayoutRouteARoute,
    PathlessLayoutNestedLayoutRouteBRoute:
      PathlessLayoutNestedLayoutRouteBRoute,
  }

const PathlessLayoutNestedLayoutRouteWithChildren =
  PathlessLayoutNestedLayoutRoute._addFileChildren(
    PathlessLayoutNestedLayoutRouteChildren,
  )

interface PathlessLayoutRouteChildren {
  PathlessLayoutNestedLayoutRoute: typeof PathlessLayoutNestedLayoutRouteWithChildren
}

const PathlessLayoutRouteChildren: PathlessLayoutRouteChildren = {
  PathlessLayoutNestedLayoutRoute: PathlessLayoutNestedLayoutRouteWithChildren,
}

const PathlessLayoutRouteWithChildren = PathlessLayoutRoute._addFileChildren(
  PathlessLayoutRouteChildren,
)

interface TanRoutesPostsRouteRouteChildren {
  TanRoutesPostsPostIdRoute: typeof TanRoutesPostsPostIdRoute
  TanRoutesPostsIndexRoute: typeof TanRoutesPostsIndexRoute
}

const TanRoutesPostsRouteRouteChildren: TanRoutesPostsRouteRouteChildren = {
  TanRoutesPostsPostIdRoute: TanRoutesPostsPostIdRoute,
  TanRoutesPostsIndexRoute: TanRoutesPostsIndexRoute,
}

const TanRoutesPostsRouteRouteWithChildren =
  TanRoutesPostsRouteRoute._addFileChildren(TanRoutesPostsRouteRouteChildren)

interface TanRoutesUsersRouteRouteChildren {
  TanRoutesUsersUserIdRoute: typeof TanRoutesUsersUserIdRoute
  TanRoutesUsersIndexRoute: typeof TanRoutesUsersIndexRoute
}

const TanRoutesUsersRouteRouteChildren: TanRoutesUsersRouteRouteChildren = {
  TanRoutesUsersUserIdRoute: TanRoutesUsersUserIdRoute,
  TanRoutesUsersIndexRoute: TanRoutesUsersIndexRoute,
}

const TanRoutesUsersRouteRouteWithChildren =
  TanRoutesUsersRouteRoute._addFileChildren(TanRoutesUsersRouteRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof PathlessLayoutNestedLayoutRouteWithChildren
  '/tan-routes/posts': typeof TanRoutesPostsRouteRouteWithChildren
  '/tan-routes/users': typeof TanRoutesUsersRouteRouteWithChildren
  '/films/$filmId': typeof FilmsFilmIdRoute
  '/people/$personId': typeof PeoplePersonIdRoute
  '/tan-routes/deferred': typeof TanRoutesDeferredRoute
  '/tan-routes/redirect': typeof TanRoutesRedirectRoute
  '/tv/$showId': typeof TvShowIdRoute
  '/films': typeof FilmsIndexRoute
  '/tan-routes': typeof TanRoutesIndexRoute
  '/tv': typeof TvIndexRoute
  '/route-a': typeof PathlessLayoutNestedLayoutRouteARoute
  '/route-b': typeof PathlessLayoutNestedLayoutRouteBRoute
  '/tan-routes/posts/$postId': typeof TanRoutesPostsPostIdRoute
  '/tan-routes/users/$userId': typeof TanRoutesUsersUserIdRoute
  '/tan-routes/posts/': typeof TanRoutesPostsIndexRoute
  '/tan-routes/users/': typeof TanRoutesUsersIndexRoute
  '/tan-routes/posts/$postId/deep': typeof TanRoutesPostsPostIdDeepRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof PathlessLayoutNestedLayoutRouteWithChildren
  '/films/$filmId': typeof FilmsFilmIdRoute
  '/people/$personId': typeof PeoplePersonIdRoute
  '/tan-routes/deferred': typeof TanRoutesDeferredRoute
  '/tan-routes/redirect': typeof TanRoutesRedirectRoute
  '/tv/$showId': typeof TvShowIdRoute
  '/films': typeof FilmsIndexRoute
  '/tan-routes': typeof TanRoutesIndexRoute
  '/tv': typeof TvIndexRoute
  '/route-a': typeof PathlessLayoutNestedLayoutRouteARoute
  '/route-b': typeof PathlessLayoutNestedLayoutRouteBRoute
  '/tan-routes/posts/$postId': typeof TanRoutesPostsPostIdRoute
  '/tan-routes/users/$userId': typeof TanRoutesUsersUserIdRoute
  '/tan-routes/posts': typeof TanRoutesPostsIndexRoute
  '/tan-routes/users': typeof TanRoutesUsersIndexRoute
  '/tan-routes/posts/$postId/deep': typeof TanRoutesPostsPostIdDeepRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_pathlessLayout': typeof PathlessLayoutRouteWithChildren
  '/tan-routes/posts': typeof TanRoutesPostsRouteRouteWithChildren
  '/tan-routes/users': typeof TanRoutesUsersRouteRouteWithChildren
  '/_pathlessLayout/_nested-layout': typeof PathlessLayoutNestedLayoutRouteWithChildren
  '/films/$filmId': typeof FilmsFilmIdRoute
  '/people/$personId': typeof PeoplePersonIdRoute
  '/tan-routes/deferred': typeof TanRoutesDeferredRoute
  '/tan-routes/redirect': typeof TanRoutesRedirectRoute
  '/tv/$showId': typeof TvShowIdRoute
  '/films/': typeof FilmsIndexRoute
  '/tan-routes/': typeof TanRoutesIndexRoute
  '/tv/': typeof TvIndexRoute
  '/_pathlessLayout/_nested-layout/route-a': typeof PathlessLayoutNestedLayoutRouteARoute
  '/_pathlessLayout/_nested-layout/route-b': typeof PathlessLayoutNestedLayoutRouteBRoute
  '/tan-routes/posts/$postId': typeof TanRoutesPostsPostIdRoute
  '/tan-routes/users/$userId': typeof TanRoutesUsersUserIdRoute
  '/tan-routes/posts/': typeof TanRoutesPostsIndexRoute
  '/tan-routes/users/': typeof TanRoutesUsersIndexRoute
  '/tan-routes/posts_/$postId/deep': typeof TanRoutesPostsPostIdDeepRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/tan-routes/posts'
    | '/tan-routes/users'
    | '/films/$filmId'
    | '/people/$personId'
    | '/tan-routes/deferred'
    | '/tan-routes/redirect'
    | '/tv/$showId'
    | '/films'
    | '/tan-routes'
    | '/tv'
    | '/route-a'
    | '/route-b'
    | '/tan-routes/posts/$postId'
    | '/tan-routes/users/$userId'
    | '/tan-routes/posts/'
    | '/tan-routes/users/'
    | '/tan-routes/posts/$postId/deep'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/films/$filmId'
    | '/people/$personId'
    | '/tan-routes/deferred'
    | '/tan-routes/redirect'
    | '/tv/$showId'
    | '/films'
    | '/tan-routes'
    | '/tv'
    | '/route-a'
    | '/route-b'
    | '/tan-routes/posts/$postId'
    | '/tan-routes/users/$userId'
    | '/tan-routes/posts'
    | '/tan-routes/users'
    | '/tan-routes/posts/$postId/deep'
  id:
    | '__root__'
    | '/'
    | '/_pathlessLayout'
    | '/tan-routes/posts'
    | '/tan-routes/users'
    | '/_pathlessLayout/_nested-layout'
    | '/films/$filmId'
    | '/people/$personId'
    | '/tan-routes/deferred'
    | '/tan-routes/redirect'
    | '/tv/$showId'
    | '/films/'
    | '/tan-routes/'
    | '/tv/'
    | '/_pathlessLayout/_nested-layout/route-a'
    | '/_pathlessLayout/_nested-layout/route-b'
    | '/tan-routes/posts/$postId'
    | '/tan-routes/users/$userId'
    | '/tan-routes/posts/'
    | '/tan-routes/users/'
    | '/tan-routes/posts_/$postId/deep'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PathlessLayoutRoute: typeof PathlessLayoutRouteWithChildren
  TanRoutesPostsRouteRoute: typeof TanRoutesPostsRouteRouteWithChildren
  TanRoutesUsersRouteRoute: typeof TanRoutesUsersRouteRouteWithChildren
  FilmsFilmIdRoute: typeof FilmsFilmIdRoute
  PeoplePersonIdRoute: typeof PeoplePersonIdRoute
  TanRoutesDeferredRoute: typeof TanRoutesDeferredRoute
  TanRoutesRedirectRoute: typeof TanRoutesRedirectRoute
  TvShowIdRoute: typeof TvShowIdRoute
  FilmsIndexRoute: typeof FilmsIndexRoute
  TanRoutesIndexRoute: typeof TanRoutesIndexRoute
  TvIndexRoute: typeof TvIndexRoute
  TanRoutesPostsPostIdDeepRoute: typeof TanRoutesPostsPostIdDeepRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PathlessLayoutRoute: PathlessLayoutRouteWithChildren,
  TanRoutesPostsRouteRoute: TanRoutesPostsRouteRouteWithChildren,
  TanRoutesUsersRouteRoute: TanRoutesUsersRouteRouteWithChildren,
  FilmsFilmIdRoute: FilmsFilmIdRoute,
  PeoplePersonIdRoute: PeoplePersonIdRoute,
  TanRoutesDeferredRoute: TanRoutesDeferredRoute,
  TanRoutesRedirectRoute: TanRoutesRedirectRoute,
  TvShowIdRoute: TvShowIdRoute,
  FilmsIndexRoute: FilmsIndexRoute,
  TanRoutesIndexRoute: TanRoutesIndexRoute,
  TvIndexRoute: TvIndexRoute,
  TanRoutesPostsPostIdDeepRoute: TanRoutesPostsPostIdDeepRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_pathlessLayout",
        "/tan-routes/posts",
        "/tan-routes/users",
        "/films/$filmId",
        "/people/$personId",
        "/tan-routes/deferred",
        "/tan-routes/redirect",
        "/tv/$showId",
        "/films/",
        "/tan-routes/",
        "/tv/",
        "/tan-routes/posts_/$postId/deep"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_pathlessLayout": {
      "filePath": "_pathlessLayout.tsx",
      "children": [
        "/_pathlessLayout/_nested-layout"
      ]
    },
    "/tan-routes/posts": {
      "filePath": "tan-routes/posts.route.tsx",
      "children": [
        "/tan-routes/posts/$postId",
        "/tan-routes/posts/"
      ]
    },
    "/tan-routes/users": {
      "filePath": "tan-routes/users.route.tsx",
      "children": [
        "/tan-routes/users/$userId",
        "/tan-routes/users/"
      ]
    },
    "/_pathlessLayout/_nested-layout": {
      "filePath": "_pathlessLayout/_nested-layout.tsx",
      "parent": "/_pathlessLayout",
      "children": [
        "/_pathlessLayout/_nested-layout/route-a",
        "/_pathlessLayout/_nested-layout/route-b"
      ]
    },
    "/films/$filmId": {
      "filePath": "films.$filmId.tsx"
    },
    "/people/$personId": {
      "filePath": "people.$personId.tsx"
    },
    "/tan-routes/deferred": {
      "filePath": "tan-routes/deferred.tsx"
    },
    "/tan-routes/redirect": {
      "filePath": "tan-routes/redirect.tsx"
    },
    "/tv/$showId": {
      "filePath": "tv.$showId.tsx"
    },
    "/films/": {
      "filePath": "films.index.tsx"
    },
    "/tan-routes/": {
      "filePath": "tan-routes/index.tsx"
    },
    "/tv/": {
      "filePath": "tv.index.tsx"
    },
    "/_pathlessLayout/_nested-layout/route-a": {
      "filePath": "_pathlessLayout/_nested-layout/route-a.tsx",
      "parent": "/_pathlessLayout/_nested-layout"
    },
    "/_pathlessLayout/_nested-layout/route-b": {
      "filePath": "_pathlessLayout/_nested-layout/route-b.tsx",
      "parent": "/_pathlessLayout/_nested-layout"
    },
    "/tan-routes/posts/$postId": {
      "filePath": "tan-routes/posts.$postId.tsx",
      "parent": "/tan-routes/posts"
    },
    "/tan-routes/users/$userId": {
      "filePath": "tan-routes/users.$userId.tsx",
      "parent": "/tan-routes/users"
    },
    "/tan-routes/posts/": {
      "filePath": "tan-routes/posts.index.tsx",
      "parent": "/tan-routes/posts"
    },
    "/tan-routes/users/": {
      "filePath": "tan-routes/users.index.tsx",
      "parent": "/tan-routes/users"
    },
    "/tan-routes/posts_/$postId/deep": {
      "filePath": "tan-routes/posts_.$postId.deep.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
