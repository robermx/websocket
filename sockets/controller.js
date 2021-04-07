const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

const socketController = (socket) => {
  // Estos eventos se disparan cuando un cliente se conecta
  socket.emit('last-ticket', ticketControl.last);
  socket.emit('actual-status', ticketControl.last4);
  socket.emit('pend-tickets', ticketControl.tickets.length);

  socket.on('next-ticket', (payload, callback) => {
    const next = ticketControl.next();
    callback(next);
    socket.broadcast.emit('pend-tickets', ticketControl.tickets.length);
  });

  socket.on('attend-ticket', ({ desktop }, callback) => {
    if (!desktop) {
      return callback({
        ok: false,
        msg: 'Escritorio es obligatorio',
      });
    }
    const ticket = ticketControl.attendTicket(desktop);

    socket.broadcast.emit('actual-status', ticketControl.last4);
    socket.emit('pend-tickets', ticketControl.tickets.length);
    socket.broadcast.emit('pend-tickets', ticketControl.tickets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: 'No hay tickets pendientes',
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
