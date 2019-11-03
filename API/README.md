**API basics:**
```
Production mode: npm start
Dev mode : npm run dev
Run tests: npm test (after one of the above)
```

**DEBUG** 
* *Edit API/scripts/apiDev.sh, instructions are given in the comments*


**TO BE IMPLEMENTED:**
```
POST /api/users/:username/chat
-> register message in history
body for request : { target: $target_username, message: $message_content}

POST /api/users/:username/visit/:target
-> register that username visited

GET /api/users/:username/visits
-> get visit history

GET /api/users/username/LIKES

GET /api/users/usrname/likedBy
```


**Routes:**
```
POST /api/users/:username/visit/:target
-> register that username visited

GET /api/users/:username/visits
-> get visit history

POST /api/users/:username/chat
-> register message in history
body for request : { target: $target_username, message: $message_content}

GET /api/notifications/:username
id for notif is in payload.result.id.low *

POST /api/notifications/create
body for request : {emitter: $emitter_username, receiver: $receiver_username, type: $notification_type }

PUT /api/notifications/read
body for request : { id: id } *


```