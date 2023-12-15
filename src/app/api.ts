import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import {RootState} from './store';
import {AuthState, updateRefreshToken, updateTokens} from './slices/authSlice';

export interface ResponseEntity {
  apiStatus: string;
  apiMsg: string;
  apiObj: unknown;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AccountDeleteRequest {
  password: string;
}

export interface GoogleSigninRequest {
  authcode: string;
}

export interface NaverSigninRequest {
  authcode: string;
  state: string;
}

export interface KakaoSigninRequest {
  authcode: string;
  nonce: string;
}

export interface ScreenCompositionSaveRequest {
  number: string;
  screenTitle: string;
  screenSetting: string;
}

export interface BoardSaveRequest {
  boardId: string | null;
  boardCategory: string;
  nickname: string;
  title: string;
  preview: string;
  content: string;
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
}

export interface ReplySaveRequest {
  replyId: string;
  boardId: string;
  parentId: string;
  nickname: string;
  content: string;
}

export type BoardPageSettingType = Record<
  'page' | 'size' | 'boardCategory' | 'sortBy',
  string
>;

export type SearchPageSettingType = Record<
  'page' | 'size' | 'boardCategory' | 'sortBy' | 'tag',
  string
>;

export interface LikeRequest {
  id: string;
  number: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_apiBaseUrl,
  prepareHeaders: (headers, {getState}) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    return headers;
  }
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    (api.getState() as RootState).auth.refreshToken
  ) {
    // try to get new tokens
    const refreshResult = await baseQuery(
      {
        url: 'refresh/tokens',
        method: 'PATCH',
        body: (api.getState() as RootState).auth
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      // store the new tokens
      api.dispatch(
        updateTokens((refreshResult.data as ResponseEntity).apiObj as AuthState)
      );
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(updateRefreshToken(null));
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['ScreenTitles'],
  endpoints: (builder) => ({
    signup: builder.mutation<ResponseEntity, SignupRequest>({
      query: (signupRequest) => ({
        url: 'permit/member/signup',
        method: 'POST',
        body: signupRequest
      })
    }),
    login: builder.mutation<ResponseEntity, LoginRequest>({
      query: (loginRequest) => ({
        url: 'login',
        method: 'PATCH',
        body: loginRequest
      })
    }),
    googleSignin: builder.mutation<ResponseEntity, GoogleSigninRequest>({
      query: (googleSigninRequest) => ({
        url: 'google/member/signin',
        method: 'POST',
        body: googleSigninRequest
      })
    }),
    naverSignin: builder.mutation<ResponseEntity, NaverSigninRequest>({
      query: (naverSigninRequest) => ({
        url: 'naver/member/signin',
        method: 'POST',
        body: naverSigninRequest
      })
    }),
    kakaoSignin: builder.mutation<ResponseEntity, KakaoSigninRequest>({
      query: (kakaoSigninRequest) => ({
        url: 'kakao/member/signin',
        method: 'POST',
        body: kakaoSigninRequest
      })
    }),
    changePassword: builder.mutation<ResponseEntity, PasswordChangeRequest>({
      query: (passwordChangeRequest) => ({
        url: 'access/member/changePassword',
        method: 'PATCH',
        body: passwordChangeRequest
      })
    }),
    deleteAccount: builder.mutation<ResponseEntity, AccountDeleteRequest>({
      query: (accountDeleteRequest) => ({
        url: 'access/member/deleteAccount',
        method: 'PATCH',
        body: accountDeleteRequest
      })
    }),
    deleteGoogleAccount: builder.mutation<ResponseEntity, GoogleSigninRequest>({
      query: (accountDeleteRequest) => ({
        url: 'google/member/deleteAccount',
        method: 'PATCH',
        body: accountDeleteRequest
      })
    }),
    deleteNaverAccount: builder.mutation<ResponseEntity, NaverSigninRequest>({
      query: (accountDeleteRequest) => ({
        url: 'naver/member/deleteAccount',
        method: 'PATCH',
        body: accountDeleteRequest
      })
    }),
    deleteKakaoAccount: builder.mutation<ResponseEntity, KakaoSigninRequest>({
      query: (accountDeleteRequest) => ({
        url: 'kakao/member/deleteAccount',
        method: 'PATCH',
        body: accountDeleteRequest
      })
    }),
    logout: builder.mutation<ResponseEntity, AuthState>({
      query: (logoutRequest) => ({
        url: 'refresh/logout',
        method: 'PATCH',
        body: logoutRequest
      })
    }),
    saveScreenComposition: builder.mutation<
      ResponseEntity,
      ScreenCompositionSaveRequest
    >({
      query: (screenCompositionSaveRequest) => ({
        url: 'access/memberSettings/saveScreenComposition',
        method: 'POST',
        body: screenCompositionSaveRequest
      }),
      invalidatesTags: ['ScreenTitles']
    }),
    loadScreenSetting: builder.mutation<ResponseEntity, string>({
      query: (number) => ({
        url: `access/memberSettings/loadScreenSetting/${number}`
      })
    }),
    loadScreenSettingDefault: builder.mutation<ResponseEntity, string>({
      query: (number) => ({
        url: `permit/memberSettings/loadScreenSettingDefault/${number}`
      })
    }),
    loadScreenTitles: builder.query<ResponseEntity, void>({
      query: () => ({
        url: `access/memberSettings/loadScreenTitles`
      }),
      providesTags: ['ScreenTitles']
    }),
    loadScreenTitlesDefault: builder.query<ResponseEntity, void>({
      query: () => ({
        url: `permit/memberSettings/loadScreenTitlesDefault`
      })
    }),
    registerBoard: builder.mutation<ResponseEntity, BoardSaveRequest>({
      query: (boardSaveRequest) => ({
        url: 'access/board/register',
        method: 'POST',
        body: boardSaveRequest
      })
    }),
    modifyBoard: builder.mutation<ResponseEntity, BoardSaveRequest>({
      query: (boardSaveRequest) => ({
        url: 'access/board/modify',
        method: 'PUT',
        body: boardSaveRequest
      })
    }),
    registerReply: builder.mutation<ResponseEntity, ReplySaveRequest>({
      query: (replySaveRequest) => ({
        url: 'access/reply/register',
        method: 'POST',
        body: replySaveRequest
      })
    }),
    modifyReply: builder.mutation<ResponseEntity, ReplySaveRequest>({
      query: (replySaveRequest) => ({
        url: 'access/reply/modify',
        method: 'PUT',
        body: replySaveRequest
      })
    }),
    deleteBoard: builder.mutation<ResponseEntity, string>({
      query: (boardId) => ({
        url: `access/board/delete/${boardId}`,
        method: 'PATCH'
      })
    }),
    deleteReply: builder.mutation<ResponseEntity, string>({
      query: (replyId) => ({
        url: `access/reply/delete/${replyId}`,
        method: 'PATCH'
      })
    }),
    likeBoard: builder.mutation<ResponseEntity, LikeRequest>({
      query: (likeRequest) => ({
        url: 'access/board/like',
        method: 'PATCH',
        body: likeRequest
      })
    }),
    likeReply: builder.mutation<ResponseEntity, LikeRequest>({
      query: (likeRequest) => ({
        url: 'access/reply/like',
        method: 'PATCH',
        body: likeRequest
      })
    }),
    readBoardPage: builder.query<ResponseEntity, BoardPageSettingType>({
      query: (boardPageSetting) => ({
        url: `permit/board/readPage`,
        params: boardPageSetting
      })
    }),
    readBoard: builder.query<ResponseEntity, string>({
      query: (boardId) => ({
        url: `permit/board/read/${boardId}`
      })
    }),
    searchBoardPage: builder.query<ResponseEntity, SearchPageSettingType>({
      query: (searchPageSetting) => ({
        url: `permit/board/searchPage`,
        params: searchPageSetting
      })
    })
  })
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGoogleSigninMutation,
  useNaverSigninMutation,
  useKakaoSigninMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useDeleteGoogleAccountMutation,
  useDeleteNaverAccountMutation,
  useDeleteKakaoAccountMutation,
  useLogoutMutation,
  useSaveScreenCompositionMutation,
  useLoadScreenSettingMutation,
  useLoadScreenSettingDefaultMutation,
  useLazyLoadScreenTitlesQuery,
  useLazyLoadScreenTitlesDefaultQuery,
  useRegisterBoardMutation,
  useModifyBoardMutation,
  useRegisterReplyMutation,
  useModifyReplyMutation,
  useDeleteBoardMutation,
  useDeleteReplyMutation,
  useLikeBoardMutation,
  useLikeReplyMutation,
  useLazyReadBoardPageQuery,
  useLazyReadBoardQuery,
  useLazySearchBoardPageQuery
} = api;
