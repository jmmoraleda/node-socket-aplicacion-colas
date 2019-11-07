const fs = require('fs'); // Filesystem para poder grabar el archivo json

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}



class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = []; // Aquí se guardarán todos los tickets que no han sido atendidos por nadie
        this.ultimos4 = []; // Aquí se guardarán los últimos 4 tickets que se están atendiendo. Los que ven los usuario en la pantalla

        let data = require('../data/data.json'); // Obtenemos los datos que teníamos previamente

        // console.log(data);

        if (data.hoy === this.hoy) { // Si estamos en el mismo día seguimos con el conteo que hay en el json

            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;

        } else { // Si no lo reiniciamos
            this.reiniciarConteo();
        }

    }

    siguiente() {

        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null); // Cuando se crea un ticket no sabemos qué escritorio lo va a atender
        this.tickets.push(ticket); // Agregamos el nuevo ticket al arreglo de tickets


        this.grabarArchivo();

        return `Ticket ${ this.ultimo }`;

    }

    getUltimoTicket() {
        return `Ticket ${ this.ultimo }`;
    }

    getUltimos4() {
        return this.ultimos4;
    }

    atenderTicket(escritorio) {

        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }

        let numeroTicket = this.tickets[0].numero; // Obtenemos el número del primer ticket que tenemos pendiente
        this.tickets.shift(); // Borramos el ticket en cuestión del arreglo

        let atenderTicket = new Ticket(numeroTicket, escritorio);

        this.ultimos4.unshift(atenderTicket); // Lo agragamos al inicio del arreglo

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); // borra el último para que sólo tengamos 4
        }

        console.log('Ultimos 4');
        console.log(this.ultimos4);

        this.grabarArchivo();

        return atenderTicket;

    }


    reiniciarConteo() {

        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];

        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();

    }


    grabarArchivo() {

        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }



}



module.exports = {
    TicketControl
}