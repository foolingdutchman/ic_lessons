import Types "/types";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";


actor Counter{
  
  public type HttpRequest =Types.HttpRequest;
  public type HttpResponse = Types.HttpResponse;

  stable var currentValue : Nat = 0;

  // Increment the counter with the increment function.
  public func increment() : async () {
    currentValue += 1;
  };

  // Read the counter value with a get function.
  public query func get() : async Nat {
    currentValue
  };

  // Write an arbitrary value with a set function.
  public func set(n: Nat) : async () {
    currentValue := n;
  };

  public shared query func http_request(request : HttpRequest ): async HttpResponse {
    {
    body = Blob.toArray(Text.encodeUtf8("<html><body><h1> Current Value is: "#  Nat.toText(currentValue) # "! </h1></body></html>"));
    headers = [];
    streaming_strategy = null;
    status_code =200;
    }
  };
  
};
