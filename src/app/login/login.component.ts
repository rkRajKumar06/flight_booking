import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { AUTHENTICATED_USER, TOKEN, UtilService } from '../util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isRegister = false;
  view: string = "Sign Up";
  myForm: FormGroup;
  signUpForm: FormGroup;
  isValid: boolean = true;
  constructor(private utilService: UtilService,private router: Router) { 
    this.myForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
    this.signUpForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      emailId: new FormControl("", [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void {
  }

  changeView(){
    this.isRegister = !this.isRegister;
    this.view = this.isRegister? "Login" : "Sign Up"; 
    this.isValid = true;
  }

  verifyLogin(){
    console.log(this.myForm.value);
    this.isValid = true;
    this.utilService.executeJWTAuthenticationService(this.myForm.get("username")?.value,this.myForm.get("password")?.value).subscribe((data)=>{
      this.router.navigate(["/", "header"]);
              
    }, (err)=>{
      this.utilService.loggedInUser = new User();
      sessionStorage.setItem("loggedInUser", JSON.stringify(new User()));
      sessionStorage.setItem(AUTHENTICATED_USER, "");
      sessionStorage.setItem(TOKEN, "");
      //sessionStorage.setItem("role", "");
      //sessionStorage.setItem("email", "");
      this.isValid = false;
      this.router.navigate(["/", "login"]);
    });
  }

  // verifyLogin(){
  //   console.log(this.myForm.value);
  //   this.isValid = true;
  //   this.utilService.login(this.myForm.get("username")?.value,this.myForm.get("password")?.value).subscribe((data:any)=>{
  //     let userArray: User[] = data;
  //     let userObj: User = userArray[0];
  //     if(userObj){
  //       this.utilService.loggedInUser = userObj;
  //       sessionStorage.setItem("loggedInUser", JSON.stringify(this.utilService.loggedInUser));
  //       this.router.navigate(["/", "header"]);
  //     }else{
  //       this.utilService.loggedInUser = new User();
  //       sessionStorage.setItem("loggedInUser", JSON.stringify(this.utilService.loggedInUser));
  //       this.isValid = false;
  //       this.router.navigate(["/", "login"]);
  //     }        
  //   });
  // }


  registerUser(){
    this.isValid = true;
    let userObj: User = new User();
    console.log(this.signUpForm.value);
    userObj.name = this.signUpForm.get("username")?.value;
    userObj.email = this.signUpForm.get("emailId")?.value;
    userObj.password = this.signUpForm.get("password")?.value;
    this.utilService.register(userObj).subscribe(
      data=>{
        console.log(data);
        this.changeView();
      }
    )
  }

}
