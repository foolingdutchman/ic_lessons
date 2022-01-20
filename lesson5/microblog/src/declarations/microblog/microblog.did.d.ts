import type { Principal } from '@dfinity/principal';
export interface BlogInfo { 'id' : string, 'name' : string }
export interface Message {
  'content' : string,
  'time' : Time,
  'author' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'follow' : (arg_0: string, arg_1: Principal) => Promise<undefined>,
  'followPosts' : (arg_0: string, arg_1: Time) => Promise<Array<Message>>,
  'follows' : () => Promise<Array<Principal>>,
  'followsInfo' : () => Promise<Array<BlogInfo>>,
  'getInfo' : () => Promise<{ 'cId' : string, 'userName' : string }>,
  'get_name' : () => Promise<[] | [string]>,
  'init' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'modifyPassword' : (arg_0: string, arg_1: string, arg_2: string) => Promise<
      undefined
    >,
  'post' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'posts' : (arg_0: Time) => Promise<Array<Message>>,
  'set_name' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'timeline' : (arg_0: Time) => Promise<Array<Message>>,
  'unfollow' : (arg_0: string, arg_1: Principal) => Promise<undefined>,
  'whoAmI' : () => Promise<string>,
}
