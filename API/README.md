**API basics:**
```
Production mode: npm start
Dev mode : npm run dev
Run tests: npm test (after one of the above)
```

**DEBUG** 
* *Edit API/scripts/apiDev.sh, instructions are given in the comments*

**New Routes:**
POST /api/users/:username/visit/:target
* *-> register that username visited*
GET /api/users/:username/visits
* *-> get visit history*
POST /api/users/:username/chat
* *-> register message in history*
body for request : { target: $target_username, message: $message_content}
