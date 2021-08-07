import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/User';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public loggedInUser: User=new User();
  constructor(private router: Router, private http: HttpClient) { }

  private url: string = "http://localhost:3000/";

  public login(username: string, password: string){
    let result: boolean = false;
    return this.http.get(this.url+"user?name="+username+"&password="+password);
    // if(username=="user" && password=="user"){
    //   this.loggedInUser.name = username;
    //   this.loggedInUser.role = "user";
    //   result = true;
    // }else if(username=="admin" && password=="admin"){
    //   this.loggedInUser.name = username;
    //   this.loggedInUser.role = "admin";
    //   result = true;
    // }else{
    //   this.loggedInUser = new User();
    //   result = false;
    // }
    // sessionStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
    // return result;
  }

  register(user: User) {
    user.role = "user";
    return this.http.post(this.url+"user", user);
  }

  getLoggedInUser(): User{
    let value = sessionStorage.getItem("loggedInUser");
    if(value!==null && value!==""){
      let user: User = JSON.parse(value);
      return user;
    }else{
      return new User();
    }
  }

  searchFlights(...args:string[]){
    return this.http.get(this.url+"schedule?fromPlace="+args[0]+"&toPlace="+args[1]+"&departure="+args[2]);
  }

  logout(){
    sessionStorage.setItem("loggedInUser", "");
    this.router.navigate(['login']);
  }

}
