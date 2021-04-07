// Referencias HTML elements
const lblNewTicket = document.querySelector('#lblNewTicket');
const lblBtn = document.querySelector('#lblBtn');

const socket = io();

socket.on('connect', () => {
  // si el servidor se conecta el botón estará activo
  lblBtn.disabled = false;
});

socket.on('disconnect', () => {
  // si el servidor se desconecta el botón estará disabled
  lblBtn.disabled = true;
});

socket.on('last-ticket', (last) => {
  lblNewTicket.innerText = 'Ticket ' + last;
});

lblBtn.addEventListener('click', () => {
  socket.emit('next-ticket', null, (ticket) => {
    lblNewTicket.innerText = ticket;
  });
});
