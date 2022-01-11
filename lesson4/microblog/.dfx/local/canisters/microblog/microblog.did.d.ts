import type { Principal } from '@dfinity/principal';
export interface Message { 'content' : string, 'time' : Time }
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'follow' : (arg_0: Principal) => Promise<undefined>,
  'follows' : () => Promise<Array<Principal>>,
  'getBalance' : () => Promise<bigint>,
  'getCanisterId' : () => Promise<[] | [Principal]>,
  'getCurrentTime' : () => Promise<bigint>,
  'init' : () => Promise<Result>,
  'post' : (arg_0: string) => Promise<undefined>,
  'posts' : (arg_0: Time) => Promise<Array<Message>>,
  'timeline' : (arg_0: Time) => Promise<Array<Message>>,
  'whoAmI' : () => Promise<Principal>,
}
