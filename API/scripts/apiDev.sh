neo4j start &&
sleep 5 &&
export matcha_jwtPrivateKey=aSecureKey
DEBUG=init:*,middleware:*,models:*,routes:*,validation:*,tests:* nodemon index.js

#DEBUG USAGE : DEBUG=DIR1:FILE1,DIR2:FILE2... do not include 'Class' if the filename contain it
# EXAMPLES :
#   TO SEE EVERYTHING
#     init:*,middleware:*,models:*,routes:*,validation:*
#   TO SEE ROUTES
#     routes:*
#   TO SEE EVERYTHING REGARDING TAGS
#     middleware:error,models:tag,routes:tags,validation:tags
