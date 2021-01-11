import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  section:String = "events";
  eventos = [];
  reservas = [];
  reservasTotales = [];
  eventosReserva = [];
  eventosCancel = [];
  error:String = "";
  errorCancel:String = "";
  rol = localStorage.getItem("rol");
  proveedor:Number = 0;
  proveedores = [];
  costoTotalReservas = 0;
  desde = "";
  hasta = "";

  constructor(
    private http: HttpClient,
    private route: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') == null || localStorage.getItem('token') == undefined || localStorage.getItem('token') == "") {
      this.route.navigate(["login"]);
    } else {
      var headers = {
        "x-auth-token": localStorage.getItem("token")
      }

      this.http.get(environment.url + "/eventos", {headers: headers}).subscribe(
        (success: any) => {
          this.eventos = success.eventos;
        },
        error => {
        }
      );

      this.http.get(environment.url + "/reserva?usuario=true", {headers: headers}).subscribe(
        (success: any) => {
          this.reservas = success.reservas;
        },
        error => {
        }
      );

      this.http.get(environment.url + "/proveedor", {headers: headers}).subscribe(
        (success: any) => {
          this.proveedores = success.proveedores;
        },
        error => {
        }
      );

      if (localStorage.getItem("rol") == "0") {
        this.getAllReservas();
      }
    }
  }

  getAllReservas() {
    var headers = {
      "x-auth-token": localStorage.getItem("token")
    }

    var url = "/reserva?usuario=false";

    if (this.proveedor != 0) {
      url += "&proveedor=" + this.proveedor
    }

    if (this.desde != "" && this.hasta != "") {
      var desde = this.desde.substr(8, 2) + "/" + this.desde.substr(5, 2) + "/" + this.desde.substr(0, 4);
      var hasta = this.hasta.substr(8, 2) + "/" + this.hasta.substr(5, 2) + "/" + this.hasta.substr(0, 4);

      url += "&desde=" + desde + "&hasta=" + hasta;
    }

    this.http.get(environment.url + url, {headers: headers}).subscribe(
      (success: any) => {
        this.reservasTotales = success.reservas;

        this.costoTotalReservas = 0;

        for (var i = 0; i < this.reservasTotales.length; i++) {
          this.costoTotalReservas += this.reservasTotales[i].evento.costo;
        }
      },
      error => {
      }
    );
  }

  setEventos(id:Number) {
    let index = this.eventosReserva.findIndex(x => x == id);
    if (index == -1) {
      this.eventosReserva.push(id);
    } else {
      this.eventosReserva.splice(index, 1);
    }
  }

  setCancelEventos(id:Number) {
    let index = this.eventosCancel.findIndex(x => x == id);
    if (index == -1) {
      this.eventosCancel.push(id);
    } else {
      this.eventosCancel.splice(index, 1);
    }
  }

  makeReserva() {
    this.error = "";

    if (this.eventosReserva.length > 0) {
      var body = {
        "eventos": this.eventosReserva
      };

      var headers = {
        "x-auth-token": localStorage.getItem("token")
      }
      
      this.http.post(environment.url + "/reserva", body, {headers: headers}).subscribe(
        (success: any) => {
          alert(success.message);
          window.location.reload();
        },
        error => {
          this.error = error.error.error;
        }
      );
    }
  }

  makeCancelReserva() {
    this.errorCancel = "";

    if (this.eventosCancel.length > 0) {
      var body = {
        "reservas": this.eventosCancel
      };

      const options = {
        headers: new HttpHeaders({
          "x-auth-token": localStorage.getItem("token")
        }),
        body: body,
      };
      
      this.http.delete(environment.url + "/reserva", options).subscribe(
        (success: any) => {
          alert(success.message);
          window.location.reload();
        },
        error => {
          this.errorCancel = error.error.error;
        }
      );
    }
  }

  irLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.route.navigate(["login"]);
  }

  irEvents() {
    this.section = "events";
  }

  irMyEvents() {
    this.section = "myevents";
  }

  irReservas() {
    this.section = "reservas";
  }
}
