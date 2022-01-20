import Array "mo:base/Array";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Type "/type";
import Iter "mo:base/Iter";


let this = actor {
      public type Blog = Type.Blog;
      public type Message = Type.Message;
      public type BlogInfo = Type.BlogInfo;
      stable var name : Text ="";
      stable var password : Text = "";
      stable var followed : [Principal] =[];
      stable var posted : [Message] =[];
      stable var INITED : Bool = false;


    public shared(msg) func follow(_password : Text ,id : Principal) : async (){
        assert(verify(_password));
       
       switch( Array.find<Principal>(followed, func(p){p == id})){
           case(? p){};
           case(None){
             followed :=  Array.append(followed,[id])
           };
       };        
    };

    public shared func unfollow(_password :Text, id :Principal) : async() {
         assert(verify(_password));
         followed := Array.filter<Principal>(followed,func(p){not (p == id)})

    };

    public shared func whoAmI() : async Text{
        Principal.toText(Principal.fromActor(this))
    };

    public shared func getInfo() : async {
        userName : Text;
        cId : Text; 
    } {
        {
            userName = name;
            cId =  Principal.toText(Principal.fromActor(this));
        }
    };

    public shared func init(_name : Text, _password : Text) :(){
        assert(not INITED);
        name := _name;
        password := _password;
        INITED := true; 

    };
    
    func verify(_password : Text) : Bool{
        password == _password
    };

    public shared func modifyPassword(_name :Text , _password : Text , _newPassword : Text){

        assert(_name == name and password == _password);
        password := _newPassword;
    };

    public shared func set_name( _password : Text ,_name : Text): async (){
        assert(verify(_password));
        name:= _name;
    };

    public shared func get_name() :async ?Text {
        Option.make(name) 
    };


    public shared query func follows() : async [Principal]{
        followed
    };

    public shared func followsInfo() :async [BlogInfo]{
        var array : [BlogInfo] =[];
        for(p in Iter.fromArray(followed)){
            let blog : Blog= actor(Principal.toText(p));
            let userName = try{
                 let n = await blog.get_name();
                 switch(n){
                     case(?cname){cname};
                     case(None){""};
                 };
            }catch(e){
                ""
            };
            array := Array.append<BlogInfo>(array,[{name = userName; id = Principal.toText(p);}]);
        };
        array
    };

    public shared(msg) func post( _password : Text , message : Text) : async (){
         assert(verify(_password));       
         posted := Array.append<Message>(posted ,
         [{
             author = name;
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
            let ps =  try{
                await blog.posts(since)
                }catch(e){
                []
            };
            result := Array.append<Message>(result,ps);
        };
        Array.sort<Message>(result, func(a,b){Nat.compare(Int.abs(a.time),Int.abs(b.time))})
    };


};
