import { Component, OnInit } from '@angular/core';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: boolean = false;
  admin: boolean = false;
  constructor(private utilService: UtilService) {
    this.user = utilService.getLoggedInUser().role=="user"? true : false;
    this.admin = utilService.getLoggedInUser().role=="admin"? true : false;
  }

  ngOnInit(): void {
  }

  logout(){
    this.utilService.logout();
  }

}
