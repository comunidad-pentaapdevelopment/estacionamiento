export class Persona{
	constructor (
		nombreUsuario: String,
		clave: String,
		email: String,
		rol: {
			descripcion: String,
			nombre: String,
			apellido:String,
			dni: Number,
			razonSocial:String,
			nombreFantasia: String,
			cuit: Number,
			saldo: Number,
				cuadras: [{
					calle: String,
					alturaDesde: Number,
					alturaHasta: Number,
					zona: String
			}]
		}
	){}
};