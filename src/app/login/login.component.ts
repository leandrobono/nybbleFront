import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form:String = "register";
  nombre:String = "";
  apellido:String = "";
  email:String = "";
  password:String = "";
  error:String = "";

  constructor(
    private http: HttpClient,
    private route: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("token") != "" && localStorage.getItem("token") != null && localStorage.getItem("token") != undefined) {
      this.route.navigate(["home"]);
    }
  }

  irLogin() {
    this.error = "";
    this.form = "login";
  }

  irRegister() {
    this.error = "";
    this.form = "register";
  }

  register() {
    this.error = "";

    var body = {
      "nombre": this.nombre,
      "apellido": this.apellido,
      "email": this.email,
      "passWord": this.password
    };
    
    this.http.post(environment.url + "/usuario", body).subscribe(
      success => {
        this.nombre = "";
        this.apellido = "";
        this.email = "";
        this.password = "";
        alert("Se registro correctamente!");
        this.irLogin();
      },
      error => {
        this.error = error.error.error;
      }
    );
  }

  login() {
    this.error = "";

    var body = {
      "email": this.email,
      "password": this.password
    };
    
    this.http.post(environment.url + "/login", body).subscribe(
      (success: any) => {
        localStorage.setItem('token', success.token);
        this.route.navigate(["home"]);
      },
      error => {
        this.error = "Datos incorrectos";
      }
    );
  }
}
