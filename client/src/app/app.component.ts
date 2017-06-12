import { Component, OnInit } from '@angular/core';
import { PersonaService } from './services/persona.service';
import { Persona } from './models/persona';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ PersonaService ]
})
export class AppComponent implements OnInit {
  public persona: Persona;
  public identity;
  public token;
  public url: string;
  public errorMessage;

  constructor(
    private _personaService: PersonaService
  ) {
    this.persona = new Persona(
/* nombreUsuario */
      ' ',
/* clave */ 
      ' ',
/* email */
      ' ',
/* rol */
      {
        descripcion: 'Admin',
        nombre: ' ',
        apellido:' ',
        dni: 0,
        razonSocial:' ',
        nombreFantasia: ' ',
        cuit: 0,
        saldo: 0,
/* cuadra */
        cuadras: [{
          calle: ' ',
          alturaDesde: 0,
          alturaHasta: 0,
          zona: ' '
        }]
      }
    )
  }

  ngOnInit() {
    this.identity = this._personaService.getIdentity();
    this.token = this._personaService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    console.log(this.persona);
    this._personaService.signup(this.persona).subscribe(
      response => {
        let identity = response.persona;
        this.identity = identity;

        if (!this.identity._id) {
          alert('El persona No esta correctamente identificado');
        }else {
          // Crear elemento en el localstorage
          // para tener al persona sesion
          localStorage.setItem('identity', JSON.stringify(identity));

          // conseguir el token para las demas pantallas
          this._personaService.signup(this.persona, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (this.token.lenght <= 0) {
                alert('El token no se ha generado');
              }else {
                // Crear elemento en el localstorage
                // para tener al token sesion
                localStorage.setItem('token', token);

                console.log(token);
                console.log(identity);
              }
            },
            error => {
              var errorMessage = <any>error;

              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }
}
