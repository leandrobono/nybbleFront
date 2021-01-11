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
  eventosReserva = [];
  error:String = "";

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

      this.http.get(environment.url + "/reserva", {headers: headers}).subscribe(
        (success: any) => {
          this.reservas = success.reservas;
          console.log(this.reservas);
        },
        error => {
        }
      );
    }
  }

  setEventos(id:Number) {
    let index = this.eventosReserva.findIndex(x => x == id);
    if (index == -1) {
      this.eventosReserva.push(id);
    } else {
      this.eventosReserva.splice(index, 1);
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

  irLogout() {
    localStorage.removeItem('token');
    this.route.navigate(["login"]);
  }

  irEvents() {
    this.section = "events";
  }

  irMyEvents() {
    this.section = "myevents";
  }
}
