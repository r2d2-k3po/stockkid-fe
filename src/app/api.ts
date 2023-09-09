import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import {RootState} from './store';
import {apiBaseUrl} from './constants/baseUrls';
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

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
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
  if (result.error && result.error.status === 401) {
    // try to get a new token
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
      // store the new token
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
  tagTypes: [],
  endpoints: (builder) => ({
    signup: builder.mutation<ResponseEntity, SignupRequest>({
      query: (signupRequest) => ({
        url: 'member/signup',
        method: 'POST',
        body: signupRequest
      })
    }),
    login: builder.mutation<ResponseEntity, LoginRequest>({
      query: (loginRequest) => ({
        url: 'member/login',
        method: 'POST',
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
    logout: builder.mutation<ResponseEntity, AuthState>({
      query: (logoutRequest) => ({
        url: 'refresh/logout',
        method: 'PATCH',
        body: logoutRequest
      })
    })
  })
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGoogleSigninMutation,
  useNaverSigninMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useDeleteGoogleAccountMutation,
  useDeleteNaverAccountMutation,
  useLogoutMutation
} = api;
