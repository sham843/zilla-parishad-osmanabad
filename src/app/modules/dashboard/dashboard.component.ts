import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  talukaData = new Array();
  lang !: string;
  schoolData = new Array();
  centerData = new Array();
  filterForm!: FormGroup;
  piechartOptions: any;
  barchartOptions: any;
  dashboardCountData:object|any;
  get f() { return this.filterForm.controls; }
  constructor(public translate: TranslateService, private masterService: MasterService,
    public webStorage: WebStorageService, private fb: FormBuilder, private apiService:ApiService,
    private error:ErrorsService) {
    this.getChart();
  }
  ngOnInit() {
    this.filterForm = this.fb.group({
      talukaId: [],
      centerId: [],
      schoolId: []
    })
    this.getTalukas();
    this.getCenters();
    this.getschools();
    this.getBarChart();
    this.getdashboardCount();

  }
  getTalukas() {
    this.masterService.getAllTaluka().subscribe((res: any) => {
      this.talukaData = res.responseData;
    })
  }
  getCenters() {
    this.masterService.getAllCenter().subscribe((res: any) => {
      this.centerData = res.responseData;
    })
  }
  getschools() {
    this.masterService.getAllSchoolType().subscribe((res: any) => {
      this.schoolData = res.responseData;
    })
  }
  getChart() {
    this.piechartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  getBarChart() {
    this.barchartOptions = {
      series: [
        [{
          name: "PRODUCT A",
          data: [44]
        },
        {
          name: "PRODUCT B",
          data: [13]
        },
        {
          name: "PRODUCT C",
          data: [11]
        }],
        [{
          name: "PRODUCT A",
          data: [24]
        },
        {
          name: "PRODUCT B",
          data: [10]
        },
        {
          name: "PRODUCT C",
          data: [48]
        }],
        [{
          name: "PRODUCT A",
          data: [65]
        },
        {
          name: "PRODUCT B",
          data: [10]
        },
        {
          name: "PRODUCT C",
          data: [37]
        }],
        [{
          name: "PRODUCT A",
          data: [65, 36, 25, 15]
        },
        {
          name: "PRODUCT B",
          data: [10, 70, 25, 42]
        },
        {
          name: "PRODUCT C",
          data: [37, 65, 74, 20]
        }],
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        labels: {
          show: false,
        },
        categories: [
          "2011 Q1",
        ]
      },

      yaxis: {
        show: false,
        showAlways: false,
        floating: false,
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        },
        labels: {
          show: false
        },

      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      }
    };
  }

  getdashboardCount(){
    const formData= this.filterForm.value;
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/GetDashboardCount?TalukaId='+(formData?.talukaId ||0)+'&CenterId='+(formData?.centerId ||0)+'&SchoolId='+(formData?.schoolId ||0), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => { 
        if (res.statusCode == "200") {
          this.dashboardCountData= res.responseData;
          const serriesArray= [0,0,0];
          serriesArray[0]= this.dashboardCountData.govtSchool|0;
          serriesArray[1]= this.dashboardCountData.privateSchool|0;
          serriesArray[2]= this.dashboardCountData.otherSchool|0;
          this.piechartOptions.series = serriesArray;
          this.piechartOptions.labels=['Goverment','Private','Other'];
           } else { 
            this.dashboardCountData=[];
          }
       },
      error: (error:any) => { this.error.handelError(error.message) }
    });
  }
}
