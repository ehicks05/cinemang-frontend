import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  content: Scalars['String'];
  deleted: Scalars['Boolean'];
  level: Scalars['Int'];
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['String']>;
  post: Post;
  postId: Scalars['String'];
  parentComment?: Maybe<Comment>;
  parentCommentId?: Maybe<Scalars['String']>;
  comments: Array<Comment>;
  score: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  netVotes: Scalars['Int'];
  userVote?: Maybe<UserCommentVote>;
};

export enum CommentSort {
  Best = 'BEST',
  Top = 'TOP',
  New = 'NEW'
}


export enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<Post>;
  adminSeed?: Maybe<Array<Maybe<Post>>>;
  adminNuke?: Maybe<Post>;
  updatePost?: Maybe<Post>;
  deletePost?: Maybe<Post>;
  createComment?: Maybe<Comment>;
  updateComment?: Maybe<Comment>;
  deleteComment?: Maybe<Comment>;
  createUserPostVote?: Maybe<Post>;
  deleteUserPostVote?: Maybe<Post>;
  createUserCommentVote?: Maybe<Comment>;
  deleteUserCommentVote?: Maybe<Comment>;
  setUsername?: Maybe<Scalars['String']>;
  deleteUser?: Maybe<User>;
};


export type MutationCreatePostArgs = {
  input?: Maybe<CreatePostInput>;
};


export type MutationUpdatePostArgs = {
  input?: Maybe<UpdatePostInput>;
};


export type MutationDeletePostArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationCreateCommentArgs = {
  input?: Maybe<CreateCommentInput>;
};


export type MutationUpdateCommentArgs = {
  input?: Maybe<UpdateCommentInput>;
};


export type MutationDeleteCommentArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationCreateUserPostVoteArgs = {
  input?: Maybe<CreateUserPostVoteInput>;
};


export type MutationDeleteUserPostVoteArgs = {
  postId?: Maybe<Scalars['ID']>;
};


export type MutationCreateUserCommentVoteArgs = {
  input?: Maybe<CreateUserCommentVoteInput>;
};


export type MutationDeleteUserCommentVoteArgs = {
  commentId?: Maybe<Scalars['ID']>;
};


export type MutationSetUsernameArgs = {
  username?: Maybe<Scalars['String']>;
};


export type MutationDeleteUserArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  title: Scalars['String'];
  link: Scalars['String'];
  content: Scalars['String'];
  deleted: Scalars['Boolean'];
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['String']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  commentCount?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  netVotes: Scalars['Int'];
  score: Scalars['Float'];
  userVote?: Maybe<UserPostVote>;
};


export type PostCommentsArgs = {
  commentSort?: Maybe<CommentSort>;
};

export type Query = {
  __typename?: 'Query';
  getPosts?: Maybe<Array<Maybe<Post>>>;
  getPostById?: Maybe<Post>;
  getComments?: Maybe<Array<Maybe<Comment>>>;
  getCommentById?: Maybe<Comment>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  getUser?: Maybe<User>;
  getMe?: Maybe<User>;
};


export type QueryGetPostsArgs = {
  sort?: Maybe<Sort>;
};


export type QueryGetPostByIdArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryGetCommentByIdArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryGetUserArgs = {
  id?: Maybe<Scalars['ID']>;
};

export enum Sort {
  Hot = 'HOT',
  Top = 'TOP',
  New = 'NEW'
}

/** A User... */
export type User = {
  __typename?: 'User';
  /** username */
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  posts: Array<Post>;
  comments: Array<Comment>;
  postVotes: Array<UserPostVote>;
  commentVotes: Array<UserCommentVote>;
};

export type UserCommentVote = {
  __typename?: 'UserCommentVote';
  userId: Scalars['String'];
  user: User;
  commentId: Scalars['String'];
  comment: Comment;
  direction: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserPostVote = {
  __typename?: 'UserPostVote';
  userId: Scalars['String'];
  user: User;
  postId: Scalars['String'];
  post: Post;
  direction: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CreateCommentInput = {
  postId: Scalars['String'];
  parentCommentId?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
  content?: Maybe<Scalars['String']>;
};

export type CreatePostInput = {
  title: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
};

export type CreateUserCommentVoteInput = {
  commentId?: Maybe<Scalars['String']>;
  direction: Direction;
};

export type CreateUserPostVoteInput = {
  postId?: Maybe<Scalars['String']>;
  direction: Direction;
};

export type UpdateCommentInput = {
  id: Scalars['ID'];
  content: Scalars['String'];
};

export type UpdatePostInput = {
  id: Scalars['ID'];
  content: Scalars['String'];
};

export type CommentFragmentFragment = { __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> };

export type CreateCommentMutationVariables = Exact<{
  input?: Maybe<CreateCommentInput>;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment?: Maybe<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }> };

export type UpdateCommentMutationVariables = Exact<{
  input?: Maybe<UpdateCommentInput>;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment?: Maybe<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }> };

export type DeleteCommentMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment?: Maybe<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }> };

export type PostFragmentFragment = { __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> };

export type GetPostsQueryVariables = Exact<{
  sort?: Maybe<Sort>;
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts?: Maybe<Array<Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }>>> };

export type GetPostByIdQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  commentSort?: Maybe<CommentSort>;
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostById?: Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, comments?: Maybe<Array<Maybe<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }>>>, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }> };

export type CreatePostMutationVariables = Exact<{
  input?: Maybe<CreatePostInput>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost?: Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }> };

export type UpdatePostMutationVariables = Exact<{
  input?: Maybe<UpdatePostInput>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }> };

export type DeletePostMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost?: Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }> };

export type GetUserQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: Maybe<{ __typename?: 'User', id: string, posts: Array<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }>, comments: Array<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, post: { __typename?: 'Post', id: string, title: string, link: string, authorId?: Maybe<string> }, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }> }> };

export type CreateUserPostVoteMutationVariables = Exact<{
  input: CreateUserPostVoteInput;
}>;


export type CreateUserPostVoteMutation = { __typename?: 'Mutation', createUserPostVote?: Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }> };

export type DeleteUserPostVoteMutationVariables = Exact<{
  postId?: Maybe<Scalars['ID']>;
}>;


export type DeleteUserPostVoteMutation = { __typename?: 'Mutation', deleteUserPostVote?: Maybe<{ __typename?: 'Post', id: string, title: string, link: string, content: string, deleted: boolean, createdAt: any, updatedAt: any, authorId?: Maybe<string>, commentCount?: Maybe<number>, netVotes: number, score: number, userVote?: Maybe<{ __typename?: 'UserPostVote', direction: number }> }> };

export type CreateUserCommentVoteMutationVariables = Exact<{
  input: CreateUserCommentVoteInput;
}>;


export type CreateUserCommentVoteMutation = { __typename?: 'Mutation', createUserCommentVote?: Maybe<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }> };

export type DeleteUserCommentVoteMutationVariables = Exact<{
  commentId?: Maybe<Scalars['ID']>;
}>;


export type DeleteUserCommentVoteMutation = { __typename?: 'Mutation', deleteUserCommentVote?: Maybe<{ __typename?: 'Comment', id: string, postId: string, content: string, deleted: boolean, level: number, createdAt: any, updatedAt: any, authorId?: Maybe<string>, parentCommentId?: Maybe<string>, score: number, netVotes: number, userVote?: Maybe<{ __typename?: 'UserCommentVote', direction: number }> }> };

export type SetUsernameMutationVariables = Exact<{
  username?: Maybe<Scalars['String']>;
}>;


export type SetUsernameMutation = { __typename?: 'Mutation', setUsername?: Maybe<string> };

export const CommentFragmentFragmentDoc = gql`
    fragment CommentFragment on Comment {
  id
  postId
  content
  deleted
  level
  createdAt
  updatedAt
  authorId
  parentCommentId
  score
  netVotes
  userVote {
    direction
  }
}
    `;
export const PostFragmentFragmentDoc = gql`
    fragment PostFragment on Post {
  id
  title
  link
  content
  deleted
  createdAt
  updatedAt
  authorId
  commentCount
  netVotes
  score
  userVote {
    direction
  }
}
    `;
export const CreateCommentDocument = gql`
    mutation createComment($input: createCommentInput) {
  createComment(input: $input) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const UpdateCommentDocument = gql`
    mutation updateComment($input: updateCommentInput) {
  updateComment(input: $input) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;
export type UpdateCommentMutationFn = Apollo.MutationFunction<UpdateCommentMutation, UpdateCommentMutationVariables>;

/**
 * __useUpdateCommentMutation__
 *
 * To run a mutation, you first call `useUpdateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCommentMutation, { data, loading, error }] = useUpdateCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCommentMutation, UpdateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument, options);
      }
export type UpdateCommentMutationHookResult = ReturnType<typeof useUpdateCommentMutation>;
export type UpdateCommentMutationResult = Apollo.MutationResult<UpdateCommentMutation>;
export type UpdateCommentMutationOptions = Apollo.BaseMutationOptions<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation deleteComment($id: ID) {
  deleteComment(id: $id) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const GetPostsDocument = gql`
    query GetPosts($sort: Sort) {
  getPosts(sort: $sort) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
export const GetPostByIdDocument = gql`
    query GetPostById($id: ID, $commentSort: CommentSort) {
  getPostById(id: $id) {
    ...PostFragment
    comments(commentSort: $commentSort) {
      ...CommentFragment
    }
  }
}
    ${PostFragmentFragmentDoc}
${CommentFragmentFragmentDoc}`;

/**
 * __useGetPostByIdQuery__
 *
 * To run a query within a React component, call `useGetPostByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      commentSort: // value for 'commentSort'
 *   },
 * });
 */
export function useGetPostByIdQuery(baseOptions?: Apollo.QueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
      }
export function useGetPostByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
        }
export type GetPostByIdQueryHookResult = ReturnType<typeof useGetPostByIdQuery>;
export type GetPostByIdLazyQueryHookResult = ReturnType<typeof useGetPostByIdLazyQuery>;
export type GetPostByIdQueryResult = Apollo.QueryResult<GetPostByIdQuery, GetPostByIdQueryVariables>;
export const CreatePostDocument = gql`
    mutation createPost($input: createPostInput) {
  createPost(input: $input) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const UpdatePostDocument = gql`
    mutation updatePost($input: updatePostInput) {
  updatePost(input: $input) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation deletePost($id: ID) {
  deletePost(id: $id) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const GetUserDocument = gql`
    query getUser($id: ID) {
  getUser(id: $id) {
    id
    posts {
      ...PostFragment
    }
    comments {
      ...CommentFragment
      post {
        id
        title
        link
        authorId
      }
    }
  }
}
    ${PostFragmentFragmentDoc}
${CommentFragmentFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const CreateUserPostVoteDocument = gql`
    mutation createUserPostVote($input: createUserPostVoteInput!) {
  createUserPostVote(input: $input) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`;
export type CreateUserPostVoteMutationFn = Apollo.MutationFunction<CreateUserPostVoteMutation, CreateUserPostVoteMutationVariables>;

/**
 * __useCreateUserPostVoteMutation__
 *
 * To run a mutation, you first call `useCreateUserPostVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserPostVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserPostVoteMutation, { data, loading, error }] = useCreateUserPostVoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserPostVoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserPostVoteMutation, CreateUserPostVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserPostVoteMutation, CreateUserPostVoteMutationVariables>(CreateUserPostVoteDocument, options);
      }
export type CreateUserPostVoteMutationHookResult = ReturnType<typeof useCreateUserPostVoteMutation>;
export type CreateUserPostVoteMutationResult = Apollo.MutationResult<CreateUserPostVoteMutation>;
export type CreateUserPostVoteMutationOptions = Apollo.BaseMutationOptions<CreateUserPostVoteMutation, CreateUserPostVoteMutationVariables>;
export const DeleteUserPostVoteDocument = gql`
    mutation deleteUserPostVote($postId: ID) {
  deleteUserPostVote(postId: $postId) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`;
export type DeleteUserPostVoteMutationFn = Apollo.MutationFunction<DeleteUserPostVoteMutation, DeleteUserPostVoteMutationVariables>;

/**
 * __useDeleteUserPostVoteMutation__
 *
 * To run a mutation, you first call `useDeleteUserPostVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserPostVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserPostVoteMutation, { data, loading, error }] = useDeleteUserPostVoteMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeleteUserPostVoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserPostVoteMutation, DeleteUserPostVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserPostVoteMutation, DeleteUserPostVoteMutationVariables>(DeleteUserPostVoteDocument, options);
      }
export type DeleteUserPostVoteMutationHookResult = ReturnType<typeof useDeleteUserPostVoteMutation>;
export type DeleteUserPostVoteMutationResult = Apollo.MutationResult<DeleteUserPostVoteMutation>;
export type DeleteUserPostVoteMutationOptions = Apollo.BaseMutationOptions<DeleteUserPostVoteMutation, DeleteUserPostVoteMutationVariables>;
export const CreateUserCommentVoteDocument = gql`
    mutation createUserCommentVote($input: createUserCommentVoteInput!) {
  createUserCommentVote(input: $input) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;
export type CreateUserCommentVoteMutationFn = Apollo.MutationFunction<CreateUserCommentVoteMutation, CreateUserCommentVoteMutationVariables>;

/**
 * __useCreateUserCommentVoteMutation__
 *
 * To run a mutation, you first call `useCreateUserCommentVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserCommentVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserCommentVoteMutation, { data, loading, error }] = useCreateUserCommentVoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserCommentVoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserCommentVoteMutation, CreateUserCommentVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserCommentVoteMutation, CreateUserCommentVoteMutationVariables>(CreateUserCommentVoteDocument, options);
      }
export type CreateUserCommentVoteMutationHookResult = ReturnType<typeof useCreateUserCommentVoteMutation>;
export type CreateUserCommentVoteMutationResult = Apollo.MutationResult<CreateUserCommentVoteMutation>;
export type CreateUserCommentVoteMutationOptions = Apollo.BaseMutationOptions<CreateUserCommentVoteMutation, CreateUserCommentVoteMutationVariables>;
export const DeleteUserCommentVoteDocument = gql`
    mutation deleteUserCommentVote($commentId: ID) {
  deleteUserCommentVote(commentId: $commentId) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;
export type DeleteUserCommentVoteMutationFn = Apollo.MutationFunction<DeleteUserCommentVoteMutation, DeleteUserCommentVoteMutationVariables>;

/**
 * __useDeleteUserCommentVoteMutation__
 *
 * To run a mutation, you first call `useDeleteUserCommentVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserCommentVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserCommentVoteMutation, { data, loading, error }] = useDeleteUserCommentVoteMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useDeleteUserCommentVoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserCommentVoteMutation, DeleteUserCommentVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserCommentVoteMutation, DeleteUserCommentVoteMutationVariables>(DeleteUserCommentVoteDocument, options);
      }
export type DeleteUserCommentVoteMutationHookResult = ReturnType<typeof useDeleteUserCommentVoteMutation>;
export type DeleteUserCommentVoteMutationResult = Apollo.MutationResult<DeleteUserCommentVoteMutation>;
export type DeleteUserCommentVoteMutationOptions = Apollo.BaseMutationOptions<DeleteUserCommentVoteMutation, DeleteUserCommentVoteMutationVariables>;
export const SetUsernameDocument = gql`
    mutation setUsername($username: String) {
  setUsername(username: $username)
}
    `;
export type SetUsernameMutationFn = Apollo.MutationFunction<SetUsernameMutation, SetUsernameMutationVariables>;

/**
 * __useSetUsernameMutation__
 *
 * To run a mutation, you first call `useSetUsernameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUsernameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUsernameMutation, { data, loading, error }] = useSetUsernameMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useSetUsernameMutation(baseOptions?: Apollo.MutationHookOptions<SetUsernameMutation, SetUsernameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetUsernameMutation, SetUsernameMutationVariables>(SetUsernameDocument, options);
      }
export type SetUsernameMutationHookResult = ReturnType<typeof useSetUsernameMutation>;
export type SetUsernameMutationResult = Apollo.MutationResult<SetUsernameMutation>;
export type SetUsernameMutationOptions = Apollo.BaseMutationOptions<SetUsernameMutation, SetUsernameMutationVariables>;