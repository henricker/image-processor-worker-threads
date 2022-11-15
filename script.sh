npx autocannon -c 100 -d 60 -t 40 -p 20 -m 'POST' -b "{\"imageUrl\":\"https://static.wikia.nocookie.net/mkwikia/images/e/ee/Predator_render.png\", \"backgroundUrl\": \"https://wallpaperaccess.com/full/3057585.jpg\"}" -H 'Content-Type: application/json' http://localhost:3000 
# # curl -X POST -d \ 
# # "{\"imageUrl\":\"https://static.wikia.nocookie.net/mkwikia/images/e/ee/Predator_render.png\", \"backgroundUrl\": \"https://wallpaperaccess.com/full/3057585.jpg\"}" \
# # http://localhost:3000 


# npx autocannon --renderStatusCodes -c 10000 -d 60 -t 40 -p 50 https://pokeapi.co/api/v2/pokemon
# curl -X POST -d \ 
# "{\"imageUrl\":\"https://static.wikia.nocookie.net/mkwikia/images/e/ee/Predator_render.png\", \"backgroundUrl\": \"https://wallpaperaccess.com/full/3057585.jpg\"}" \
# http://localhost:3000 