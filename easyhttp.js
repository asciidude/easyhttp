'use strict';

// Dependencies //
const http = require('http');

const fs = require('fs');
const path = require('path');

const Emitter = require('events');

// Class //
class Server extends Emitter {
    constructor() {
        super();
        this.routes = [];
    }

    /**
     * Create a route
     * @param {String} method Method to use for this route
     * @param {String} url The route URL (/hello/word)
     * @param {String} viewPath The path to render
     * @param {Number} status The status to use (200 default)
     */
    route(method, url, viewPath, status) {
        const route = {
            'method': method.toUpperCase(),
            'url': url,
            'viewPath': viewPath,
            'status': status || 200,
            'extension': String(path.extname(viewPath)).toLowerCase(),
            'id': String(Date.now() + this.routes.length)
        }

        this.routes.push(route);
        this.emit('routeCreated', route);
    }

    /**
     * @param {Number} port 
     * @param {Function} callback 
     */
    listen(port, callback) {
        let server = http.createServer((request, response) => {
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.wav': 'audio/wav',
                '.mp4': 'video/mp4',
                '.woff': 'application/font-woff',
                '.ttf': 'application/font-ttf',
                '.eot': 'application/vnd.ms-fontobject',
                '.otf': 'application/font-otf',
                '.wasm': 'application/wasm',
            };
            
            for(const route of this.routes) {
                if(request.url === route.url && request.method === route.method) {
                    if(this.debug) process.stdout.write(`[DEBUG] User connected to route ${route.url}\n`);
                    fs.readFile(route.viewPath, (err, content) => {
                        if(err) throw err;
                        response.writeHead(route.status, { 'Content-Type': mimeTypes[route.extension] ?? 'application/octet-stream' });
                        response.end(content, 'utf8');
                        this.emit('routeConnected', route);
                    })
                }
            }

        }).listen(port);
        
        if(callback) server.on('listening', callback);
    }
}

// Exports //
module.exports.Server = Server;
