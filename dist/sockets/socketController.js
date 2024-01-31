export function socketController(socket) {
    socket.on("join-match", function (data) {
        // socket.join(sala);
        // partidas[sala] = partidas[sala] ?? {}
        // partidas[sala].jugadores = partidas[sala]?.jugadores ?? []
        // partidas[sala].jugadores?.push(socket.id)
        // console.log(partidas);
    });
    socket.on('mensajeGlobal', (data) => {
        const { sala, mensaje } = JSON.parse(data);
        console.log("Mensaje enviado..." + mensaje);
        socket.broadcast.to(sala).emit('mensajeGlobal', { mensaje });
    });
}
//# sourceMappingURL=socketController.js.map