
import Time "mo:base/Time";

module{

    public type Message ={
        content : Text;
        time : Time.Time;
    };

    public type Blog = actor {

        follow : shared(Principal) -> async ();
        follows : shared query () -> async [Principal];
        post : shared (Text) -> async ();
        posts : shared query (since : Time.Time) -> async [Message];
        timeline : shared (since : Time.Time ) -> async [Message];
    };
}