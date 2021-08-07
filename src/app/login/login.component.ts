import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isRegister = false;
  view: string = "Login";
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
    this.view = this.isRegister? "Sign Up": "Login"; 
    this.isValid = true;
  }

  verifyLogin(){
    console.log(this.myForm.value);
    this.isValid = true;
    this.utilService.login(this.myForm.get("username")?.value,this.myForm.get("password")?.value).subscribe((data:any)=>{
      let userArray: User[] = data;
      let userObj: User = userArray[0];
      //console.log("test data"+userObj.name);
      if(userObj){
        this.utilService.loggedInUser.name = userObj.name;
        this.utilService.loggedInUser.role = userObj.role;
        sessionStorage.setItem("loggedInUser", JSON.stringify(this.utilService.loggedInUser));
        this.router.navigate(["/", "header"]);
      }else{
        this.utilService.loggedInUser = new User();
        sessionStorage.setItem("loggedInUser", JSON.stringify(this.utilService.loggedInUser));
        this.isValid = false;
        this.router.navigate(["/", "login"]);
      }        
    });
    // if(authenticatedUser || this.utilService.getLoggedInUser().role=="user"){
    //   this.router.navigate(["/", "header"]);
    // }else{
    //   this.router.navigate(["/", "login"]);
    //   this.isValid = false;
    // }
  }

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
    // if(){
      
    // }else{
    //   this.isValid = false;
    // }
  }

}
