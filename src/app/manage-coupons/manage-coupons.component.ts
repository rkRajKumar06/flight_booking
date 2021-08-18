import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Coupons } from '../model/Coupons';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.component.html',
  styleUrls: ['./manage-coupons.component.scss']
})
export class ManageCouponsComponent implements OnInit {

  couponFormGroup: FormGroup;
  couponsList: Coupons[] = [];
  constructor(private utilservice: UtilService) { 
    this.getAllCoupons();
    this.couponFormGroup = new FormGroup({
      coupon: new FormControl('', Validators.required),
      percentage: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  getAllCoupons(){
    this.utilservice.getAllCoupons().subscribe((data:any) => {
      this.couponsList = data;
    });
  }

  saveCoupons(){
    let obj: Coupons = new Coupons();
    obj.name = this.couponFormGroup.get('coupon')?.value;
    obj.percentage = this.couponFormGroup.get('percentage')?.value;
    obj.name = obj.name.toUpperCase();
    this.utilservice.saveCoupon(obj).subscribe(()=>{
      this.getAllCoupons();
      this.couponFormGroup.reset();
    });
  }

  blockOrEnableCoupon(obj: Coupons){
    obj.inactive = !obj.inactive;
    this.utilservice.updateCoupon(obj).subscribe(()=>{
      this.getAllCoupons();
    });
  }
}
