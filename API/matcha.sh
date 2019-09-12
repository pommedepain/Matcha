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
DEBUG=app:startup,app:model_user,app:model_relationship,app:model_tag,app:route_user,app:middleware_auth,app:middleware_error,app:middleware_admin,app:debug,app:validator, nodemon index.js
