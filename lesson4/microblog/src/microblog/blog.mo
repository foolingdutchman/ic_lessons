import Type "/type";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";


actor class MicroBlog(_owner : Principal ,_contractor : Principal){
    public type Blog = Type.Blog;
    public type Message = Type.Message;
    stable var owner : Principal = _owner;
    stable var contractor : Principal = _contractor;
    stable var followed : [Principal] =[];
    stable var posted : [Message] =[];


    public shared(msg) func follow(id : Principal) : async (){
        assert(msg.caller == contractor or msg.caller == owner);
       
       switch( Array.find<Principal>(followed, func(p){p == id})){
           case(? p){};
           case(None){
             followed :=  Array.append(followed,[id])
           };
       };        
    };

    public shared query func follows() : async [Principal]{
        followed
    };

    public shared(msg) func post( message : Text) : async (){
         assert(msg.caller == contractor or msg.caller == owner);
         
         posted := Array.append<Message>(posted ,
         [{
             content = message;
             time = Time.now();
         }])

    };

    public shared query func posts(since : Time.Time) : async [Message]{
        Array.filter<Message>(posted, func(p){p.time > since})

    };

    public shared func timeline(since : Time.Time) : async [Message]{
        var result : [Message] =[]; 
        for(p in Iter.fromArray(followed)){
            let blog : Blog= actor(Principal.toText(p));
            let ps = await blog.posts(since);
            result := Array.append<Message>(result,ps);
        };
        Array.sort<Message>(result, func(a,b){Nat.compare(Int.abs(a.time),Int.abs(b.time))})

    };


    
};
