# microblog



```bash
cd microblog/

```
## Running the project locally

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

```shell
DEFAULT_ID="principal \"$(dfx --identity default identity get-principal | sed 's/[\\(\\)]//g')\""

echo $DEFAULT_ID

dfx canister call microblog init

dfx canister call microblog post "(\" first blog \")"

dfx canister call microblog posts "(100000000)"

```
You will find result like this: 

```shell

(
  vec {
    record { content = " first blog "; time = 1_641_893_890_742_505_000 : int };
  },
)
```
You can follow another identity 
```shell
XIAOMING="principal \"$(dfx --identity xiaoming identity get-principal | sed 's/[\\(\\)]//g')\""

echo $XIAOMING

dfx canister call microblog follow "($XIAOMING)"

```

You may find result like this: 

```shell
 (vec {})

```

As XIAOMING didnt init his canister yet, so u need to change XIAOMING 's identity to default, then run :

```shell
 dfx canister call microblog init

 dfx canister call microblog post "(\" second blog \")"

 dfx canister call microblog posts "(100000000)"

```
now u can follow XIAOMING and get his posts

```shell
dfx canister call microblog follow "($XIAOMING)"

 dfx canister call microblog follows   

 dfx canister call microblog timeline "(100000000)"

```
