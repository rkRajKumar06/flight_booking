import { Injectable } from '@angular/core';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private loggedInUser: User=new User("", "", "");
  constructor() { }

  public login(username: string, password: string, role: string): boolean{
    let result: boolean = false;
    if(username=="user" && password=="user" && role=="user"){
      this.loggedInUser.name = username;
      this.loggedInUser.role = role;
      result = true;
    }else if(username=="admin" && password=="admin" && role=="admin"){
      this.loggedInUser.name = username;
      this.loggedInUser.role = role;
      result = true;
    }else{
      this.loggedInUser = new User("", "", "");
      result = false;
    }
    sessionStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
    return result;
  }

  getLoggedInUser(): User{
    let value = sessionStorage.getItem("loggedInUser");
    if(value!==null){
      let user: User = JSON.parse(value);
      return user;
    }else{
      return new User("", "", "");
    }
  }


}
