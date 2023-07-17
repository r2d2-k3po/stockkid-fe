import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from './store';
import {apiBaseUrl} from './constants/baseUrls';

export interface User {
  username: string;
}

export interface ResponseEntity {
  responseStatus: string;
  responseMessage: string;
  responseObject: unknown;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    jsonContentType: 'application/json'
  }),
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
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),
    protected: builder.mutation<{message: string}, void>({
      query: () => 'protected'
    })
  })
});

export const {useSignupMutation, useLoginMutation, useProtectedMutation} = api;
