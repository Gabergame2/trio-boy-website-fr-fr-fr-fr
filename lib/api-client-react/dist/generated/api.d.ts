import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminProfile, HealthStatus, Post, PostInput, PostUpdate, SendResult, Subscriber, SubscriberInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSubscribeToNewsletterUrl: () => string;
/**
 * @summary Subscribe an email address
 */
export declare const subscribeToNewsletter: (subscriberInput: SubscriberInput, options?: RequestInit) => Promise<Subscriber>;
export declare const getSubscribeToNewsletterMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof subscribeToNewsletter>>, TError, {
        data: BodyType<SubscriberInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof subscribeToNewsletter>>, TError, {
    data: BodyType<SubscriberInput>;
}, TContext>;
export type SubscribeToNewsletterMutationResult = NonNullable<Awaited<ReturnType<typeof subscribeToNewsletter>>>;
export type SubscribeToNewsletterMutationBody = BodyType<SubscriberInput>;
export type SubscribeToNewsletterMutationError = ErrorType<void>;
/**
* @summary Subscribe an email address
*/
export declare const useSubscribeToNewsletter: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof subscribeToNewsletter>>, TError, {
        data: BodyType<SubscriberInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof subscribeToNewsletter>>, TError, {
    data: BodyType<SubscriberInput>;
}, TContext>;
export declare const getGetAdminProfileUrl: () => string;
/**
 * @summary Get the signed-in admin profile
 */
export declare const getAdminProfile: (options?: RequestInit) => Promise<AdminProfile>;
export declare const getGetAdminProfileQueryKey: () => readonly ["/api/admin/me"];
export declare const getGetAdminProfileQueryOptions: <TData = Awaited<ReturnType<typeof getAdminProfile>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminProfile>>>;
export type GetAdminProfileQueryError = ErrorType<void>;
/**
 * @summary Get the signed-in admin profile
 */
export declare function useGetAdminProfile<TData = Awaited<ReturnType<typeof getAdminProfile>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAdminPostsUrl: () => string;
/**
 * @summary List newsletter posts
 */
export declare const listAdminPosts: (options?: RequestInit) => Promise<Post[]>;
export declare const getListAdminPostsQueryKey: () => readonly ["/api/admin/posts"];
export declare const getListAdminPostsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminPosts>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminPosts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminPostsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminPosts>>>;
export type ListAdminPostsQueryError = ErrorType<void>;
/**
 * @summary List newsletter posts
 */
export declare function useListAdminPosts<TData = Awaited<ReturnType<typeof listAdminPosts>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAdminPostUrl: () => string;
/**
 * @summary Create a newsletter post
 */
export declare const createAdminPost: (postInput: PostInput, options?: RequestInit) => Promise<Post>;
export declare const getCreateAdminPostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminPost>>, TError, {
        data: BodyType<PostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminPost>>, TError, {
    data: BodyType<PostInput>;
}, TContext>;
export type CreateAdminPostMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminPost>>>;
export type CreateAdminPostMutationBody = BodyType<PostInput>;
export type CreateAdminPostMutationError = ErrorType<unknown>;
/**
* @summary Create a newsletter post
*/
export declare const useCreateAdminPost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminPost>>, TError, {
        data: BodyType<PostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminPost>>, TError, {
    data: BodyType<PostInput>;
}, TContext>;
export declare const getUpdateAdminPostUrl: (id: number) => string;
/**
 * @summary Update a newsletter post
 */
export declare const updateAdminPost: (id: number, postUpdate: PostUpdate, options?: RequestInit) => Promise<Post>;
export declare const getUpdateAdminPostMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminPost>>, TError, {
        id: number;
        data: BodyType<PostUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminPost>>, TError, {
    id: number;
    data: BodyType<PostUpdate>;
}, TContext>;
export type UpdateAdminPostMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminPost>>>;
export type UpdateAdminPostMutationBody = BodyType<PostUpdate>;
export type UpdateAdminPostMutationError = ErrorType<void>;
/**
* @summary Update a newsletter post
*/
export declare const useUpdateAdminPost: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminPost>>, TError, {
        id: number;
        data: BodyType<PostUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminPost>>, TError, {
    id: number;
    data: BodyType<PostUpdate>;
}, TContext>;
export declare const getDeleteAdminPostUrl: (id: number) => string;
/**
 * @summary Delete a newsletter post
 */
export declare const deleteAdminPost: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteAdminPostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminPost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAdminPost>>, TError, {
    id: number;
}, TContext>;
export type DeleteAdminPostMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAdminPost>>>;
export type DeleteAdminPostMutationError = ErrorType<unknown>;
/**
* @summary Delete a newsletter post
*/
export declare const useDeleteAdminPost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminPost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAdminPost>>, TError, {
    id: number;
}, TContext>;
export declare const getSendAdminPostUrl: (id: number) => string;
/**
 * @summary Send a newsletter post to active subscribers
 */
export declare const sendAdminPost: (id: number, options?: RequestInit) => Promise<SendResult>;
export declare const getSendAdminPostMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendAdminPost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendAdminPost>>, TError, {
    id: number;
}, TContext>;
export type SendAdminPostMutationResult = NonNullable<Awaited<ReturnType<typeof sendAdminPost>>>;
export type SendAdminPostMutationError = ErrorType<void>;
/**
* @summary Send a newsletter post to active subscribers
*/
export declare const useSendAdminPost: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendAdminPost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendAdminPost>>, TError, {
    id: number;
}, TContext>;
export declare const getListAdminSubscribersUrl: () => string;
/**
 * @summary List newsletter subscribers
 */
export declare const listAdminSubscribers: (options?: RequestInit) => Promise<Subscriber[]>;
export declare const getListAdminSubscribersQueryKey: () => readonly ["/api/admin/subscribers"];
export declare const getListAdminSubscribersQueryOptions: <TData = Awaited<ReturnType<typeof listAdminSubscribers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminSubscribers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminSubscribers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminSubscribersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminSubscribers>>>;
export type ListAdminSubscribersQueryError = ErrorType<unknown>;
/**
 * @summary List newsletter subscribers
 */
export declare function useListAdminSubscribers<TData = Awaited<ReturnType<typeof listAdminSubscribers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminSubscribers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRemoveAdminSubscriberUrl: (id: number) => string;
/**
 * @summary Remove a newsletter subscriber
 */
export declare const removeAdminSubscriber: (id: number, options?: RequestInit) => Promise<void>;
export declare const getRemoveAdminSubscriberMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeAdminSubscriber>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeAdminSubscriber>>, TError, {
    id: number;
}, TContext>;
export type RemoveAdminSubscriberMutationResult = NonNullable<Awaited<ReturnType<typeof removeAdminSubscriber>>>;
export type RemoveAdminSubscriberMutationError = ErrorType<unknown>;
/**
* @summary Remove a newsletter subscriber
*/
export declare const useRemoveAdminSubscriber: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeAdminSubscriber>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeAdminSubscriber>>, TError, {
    id: number;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map