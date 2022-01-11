export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Message = IDL.Record({ 'content' : IDL.Text, 'time' : Time });
  return IDL.Service({
    'follow' : IDL.Func([IDL.Principal], [], []),
    'follows' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getBalance' : IDL.Func([], [IDL.Nat], []),
    'getCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], []),
    'getCurrentTime' : IDL.Func([], [IDL.Int], []),
    'init' : IDL.Func([], [Result], []),
    'post' : IDL.Func([IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], []),
    'timeline' : IDL.Func([Time], [IDL.Vec(Message)], []),
    'whoAmI' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
