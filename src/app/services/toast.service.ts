import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastrService) { 
    this.toast.toastrConfig.positionClass = "toast-bottom-center";
    this.toast.toastrConfig.maxOpened = 1;
    this.toast.toastrConfig.closeButton = true;
    this.toast.toastrConfig.tapToDismiss = false;
  }

  success(text:string, title:string){
    this.toast.success(text,title);
  }

  error(text:string, title:string){
    this.toast.error(text,title);
  }

  info(text:string, title:string){
    this.toast.info(text,title);
  }

  warning(text:string,title:string){
    this.toast.warning(text,title);
  }

  remove(){
    this.toast.clear();
  }

  charge(text:string,title:string){
    this.toast.show(text,title,{disableTimeOut:true, closeButton: false},'toast-custom');
  }
}
