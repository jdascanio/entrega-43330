import { Server } from "socket.io"

let products = []
export {products}

export function configSocketServer(httpServer) {
    const socketServer = new Server(httpServer);
  
    socketServer.on('connection', (socket) => {
      console.log('nuevo usuario conectado');      
  
      // socket.on('update', (updatedProducts) => {
      //   socketServer.emit('enviado', console.log(updatedProducts));
      // });
    });
  
    return socketServer;
  }
