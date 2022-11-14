import http from 'http';
import { imageBackgroundPoolThreads } from '../workers/index.js';

function joinImages(images) {
    return imageBackgroundPoolThreads.run(images) 
}

async function handler(request, response) {
    try {
        let images = {}
        for await(const data of request) {
            images = JSON.parse(data ?? '{}')
        }

        const imageBase64 = await joinImages(images)

        response.writeHead(200, {
            'Content-Type': 'text/html'
        })

        response.end(`<img style="width:100%;height:100%" src="data:image/jpeg;base64,${imageBase64}" />`) 
    } catch(err) {
        if(err.message === 'Internal Server Error') {
            console.log(err.stack) //For now we will just log the error, but eventually we will send it to a service like Sentry
            response.writeHead(500)
            response.end('Internal server error')
            return;
        }

        response.writeHead(400)
        response.end(err.message)
        return
    }
}

export const server = http.createServer(handler);

server.listen(3000, console.log('Server is listening on port 3000'));