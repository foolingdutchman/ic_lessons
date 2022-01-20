export const idlFactory = ({ IDL }) => {
  const BlogInfo = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const Time = IDL.Int;
  const Message = IDL.Record({
    'content' : IDL.Text,
    'time' : Time,
    'author' : IDL.Text,
  });
  return IDL.Service({
    'follow' : IDL.Func([IDL.Text, IDL.Principal], [], []),
    'follows' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'followsInfo' : IDL.Func([], [IDL.Vec(BlogInfo)], []),
    'getInfo' : IDL.Func(
        [],
        [IDL.Record({ 'cId' : IDL.Text, 'userName' : IDL.Text })],
        [],
      ),
    'get_name' : IDL.Func([], [IDL.Opt(IDL.Text)], []),
    'init' : IDL.Func([IDL.Text, IDL.Text], [], ['oneway']),
    'modifyPassword' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], ['oneway']),
    'post' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], ['query']),
    'set_name' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'timeline' : IDL.Func([Time], [IDL.Vec(Message)], []),
    'unfollow' : IDL.Func([IDL.Text, IDL.Principal], [], []),
    'whoAmI' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
