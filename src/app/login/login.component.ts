import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  visible: boolean = false;
  constructor(private utilService: UtilService,private router: Router) { 
    this.myForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      role: new FormControl("", [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  verifyLogin(){
    console.log(this.myForm.value);
    let authenticatedUser: boolean = this.utilService.login(this.myForm.get("username")?.value,this.myForm.get("password")?.value,this.myForm.get("role")?.value);
    if(authenticatedUser || this.utilService.getLoggedInUser().role=="user"){
      this.router.navigate(["/", "header"]);
      this.visible = true;
    }else{
      this.router.navigate(["/", "login"]);
      this.visible = false;
    }
  }

}
