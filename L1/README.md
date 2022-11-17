# Lab 1 - Multi Client Message Server

Lab assignment 1 for course ID1212.

## Note

The `Server` object uses a private class `Handler` for client handler threads. 
Clients run a separate thread for writing to the output stream.

The `lock` semaphore is purely used for variation, the same effect could be achieved
using synchronized blocks on the handlers.

## Instructions

The files should be placed in the directory `L1`. Running the client (or server):

```shell
javac L1/Client.java
java L1.Client [host] [port]
```

Default host is `127.0.0.1` and port `8080`.
