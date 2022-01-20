
import Time "mo:base/Time";

module{

    public type Message ={
        author  : Text;
        content : Text;
        time : Time.Time;
    };

    public type Blog = actor {

        follow : shared(Principal) -> async ();
        follows : shared query () -> async [Principal];
        post : shared (Text) -> async ();
        posts : shared query (since : Time.Time) -> async [Message];
        timeline : shared (since : Time.Time ) -> async [Message];
        get_name : shared () -> async Text ;
    };

    public type BlogInfo ={
        name : Text;
        id : Text;
    };
}