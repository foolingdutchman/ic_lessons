import Array "mo:base/Array";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import MicroBlog "/blog";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Type "/type";
import Iter "mo:base/Iter";

let this = actor {
    public type Blog =Type.Blog;
    public type Message = Type.Message;
    public type MicroBlog = Type.Blog;
    
    stable var idToCanisterArray : [(Principal,Principal)] =[];

     let idToCanister = HashMap.HashMap<Principal,Principal>(idToCanisterArray.size(),Principal.equal,Principal.hash); // user identity to canister ID
     let canisterToId = HashMap.HashMap<Principal,Principal>(idToCanisterArray.size(),Principal.equal,Principal.hash); // canister ID to user identity
     
     for((p,id) in Iter.fromArray(idToCanisterArray)){
         idToCanister.put(p,id);
         canisterToId.put(id,p);
     };
     
    system func preupgrade() {   
        idToCanisterArray  := Iter.toArray(idToCanister.entries());
         
    };

    system func postupgrade() {
        idToCanisterArray   := [];
    };

    public shared func whoAmI() : async Principal{
        Principal.fromActor(this)
    };

    public shared func getCurrentTime() : async Int {
        Time.now()
    };

    public shared(msg) func getCanisterId() : async ?Principal {
        idToCanister.get(msg.caller)
    };


    public shared func getBalance() :async Nat {
        ExperimentalCycles.balance();
    };

    public shared(msg) func init() :async Result.Result<(),Text>{
        switch(idToCanister.get(msg.caller)){
            case(? p){
                #err("Already exist!")
            };
            case(None){
                let canister = await MicroBlog.MicroBlog(msg.caller , Principal.fromActor(this));
                idToCanister.put(msg.caller, Principal.fromActor(canister));
                canisterToId.put(Principal.fromActor(canister),msg.caller);
                return #ok();
            };
        }
    };

    public shared(msg) func follow(id : Principal) : async (){
        switch(idToCanister.get(msg.caller)){
            case(? p){
                let blog : Blog= actor(Principal.toText(p));
                switch(idToCanister.get(id)){
                    case(? cId){
                        await blog.follow(cId);
                    };
                    case(None){};
                }        
            };
            case(None){};
        }
    };

    public shared(msg) func follows() : async [Principal]{
        switch(idToCanister.get(msg.caller)){
            case(? p){
              let blog : Blog= actor(Principal.toText(p));
              let ps = await blog.follows();  
              Array.map<Principal,Principal>(ps,func(p){Option.unwrap(canisterToId.get(p))})
            };
            case(None){[]};
        };
    };

    public shared(msg) func post(message : Text) : async (){

         switch(idToCanister.get(msg.caller)){
            case(? p){
              let blog : Blog= actor(Principal.toText(p));
               await blog.post(message);
            };
            case(None){};
        };
    };

    public shared(msg) func posts(since : Time.Time) : async [Message]{
          switch(idToCanister.get(msg.caller)){
            case(? p){
              let blog : Blog= actor(Principal.toText(p));
              let r=  await blog.posts(since);
              r
            };
            case(None){[]};
        };

    };

    public shared(msg) func timeline(since : Time.Time) : async [Message]{
        switch(idToCanister.get(msg.caller)){
            case(? p){
              let blog : Blog= actor(Principal.toText(p));
              let r=  await blog.timeline(since);
              r
            };
            case(None){[]};
        };

    };
    
};
