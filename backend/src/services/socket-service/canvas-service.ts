import { AppSocket } from ".";

const setupSocketCanvas = async (socket: AppSocket) => {
  socket.on("sendCanvasLine", async (publicId, line) => {
    socket.nsp.to(`room_${publicId}`).emit("canvasLine", line);
  });
};

export default setupSocketCanvas;
