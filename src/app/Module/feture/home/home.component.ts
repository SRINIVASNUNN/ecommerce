import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/state/Auth/auth.service';
import { gounsPage1 } from 'src/Data/Gouns/gouns';
import { mens_kurta } from 'src/Data/Men/men_kurta';
import { lehngacholiPage2 } from 'src/Data/Saree/lenghaCholiPage2';
import { mensShoesPage1 } from 'src/Data/shoes';
import { productdata } from 'src/productsData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  products:any[]=[]
  gouns:any
  saree:any
  men_kurta:any
  shoes:any

  constructor(private authService: AuthService) {
    this.products = productdata.slice(0, 5);
    this.gouns= gounsPage1.slice(0,5)
    this.saree=lehngacholiPage2.slice(0,5)
    this.men_kurta=mens_kurta.slice(0,5)
    this.shoes=mensShoesPage1.slice(0,5)
  }
  ngOnInit(): void {
    const fakeCredentials = {
      email: 'fake@example.com',
      password: 'fakePassword123'
    };

    // Perform fake login
    this.authService.login(fakeCredentials);
  }

}
