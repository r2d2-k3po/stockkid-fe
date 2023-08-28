import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {naverApiBaseUrl} from './constants/baseUrls';
import {naverCallbackUrl, naverClientId} from './constants/clientInfo';

export const naverApi = createApi({
  reducerPath: 'naverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: naverApiBaseUrl
  }),
  endpoints: (builder) => ({
    naverLogin: builder.mutation({
      query: (naverState) => ({
        url: `authorize?response_type=code&client_id=${naverClientId}&state=${naverState}&redirect_uri=${encodeURIComponent(
          naverCallbackUrl
        )}`,
        method: 'GET'
      })
    })
  })
});

export const {useNaverLoginMutation} = naverApi;
