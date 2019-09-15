# app:startup,
# app:model_user,
# app:model_tag,
# app:model_relationship,
# app:route_user,
# app:middleware_auth,
# app:middleware_error,
# app:middleware_admin
# app:validator

export matcha_jwtPrivateKey=aSecureKey
DEBUG=init:*,middleware:*,models:*,routes:*,validation:* nodemon index.js
