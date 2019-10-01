# app:startup,
# app:model_user,
# app:route_user,
# app:middleware_auth,
# app:middleware_error,
# app:middleware_admin
# app:validator

export matcha_jwtPrivateKey=aSecureKey
DEBUG=app:startup,app:model_user,app:route_user,app:middleware_auth,app:middleware_error,app:middleware_admin,app:debug,app:validator nodemon index.js
