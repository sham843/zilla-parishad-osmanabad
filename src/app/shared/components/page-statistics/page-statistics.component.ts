import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-page-statistics',
  templateUrl: './page-statistics.component.html',
  styleUrls: ['./page-statistics.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    TranslateModule
    ]
})
export class PageStatisticsComponent implements OnInit {

  statisticsArray = new Array();

  constructor(private apiService: ApiService,
    private ngxSpinner: NgxSpinnerService,
    public webStorage: WebStorageService,
    private errors: ErrorsService){

  }

  ngOnInit(): void {
    this.getStatisticsDetails();
    this.apiService.staticData.subscribe((res: any) => {
      console.log(res);
      this.getStatisticsDetails();
    });
  }

  getStatisticsDetails(){
    this.apiService.setHttp('get', 'zp-osmanabad/Dashboard/GetMasterDataCount', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.statisticsArray = [];
          this.statisticsArray.push(res?.responseData);      
        }
      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
    });
  }

}
