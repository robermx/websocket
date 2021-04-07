// Referencias HTML elements
const textMain = document.querySelector('#textMain');
const smallText = document.querySelector('#smallText');
const btnAttend = document.querySelector('#btnAttend');
const alertTicket = document.querySelector('#alertTicket');
const lblPend = document.querySelector('#lblPend');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error(`escritorio es obligatorio`);
}

const desktop = searchParams.get('escritorio');
textMain.innerText = desktop;

alertTicket.style.display = 'none';

const socket = io();

socket.on('connect', () => {
  // si el servidor se conecta el botón estará activo
  btnAttend.disabled = false;
});

socket.on('disconnect', () => {
  // si el servidor se desconecta el botón estará disabled
  btnAttend.disabled = true;
});

socket.on('pend-tickets', (pend) => {
  if (pend === 0) {
    lblPend.style.display = 'none';
  } else {
    lblPend.style.display = '';
    lblPend.innerText = pend;
  }
});

btnAttend.addEventListener('click', () => {
  socket.emit('attend-ticket', { desktop }, ({ ok, ticket, msg }) => {
    if (!ok) {
      smallText.innerText = 'Nadie';
      return (alertTicket.style.display = '');
    }
    smallText.innerText = 'Ticket ' + ticket.number;
  });
});
