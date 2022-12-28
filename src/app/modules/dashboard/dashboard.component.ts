import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit,AfterViewInit {
  talukaData = new Array();
  lang !: string;
  schoolData = new Array();
  centerData = new Array();
  subjectData= new Array();
  filterForm!: FormGroup;
  filterFormForBarGraph!: FormGroup;
  piechartOptions: any;
  barchartOptions: any;
  dashboardCountData=new Array();
  tableColumn=new Array();
  barChartData=new Array();
  showBarChartF:boolean=false;
  selectedObj!:object|any;
  barChartByTalukaData=new Array();
  get f() { return this.filterForm.controls }
  get fBgraph() { return this.filterFormForBarGraph.controls}
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
    this.filterFormForBarGraph = this.fb.group({
      filtertalukaId: [],
      filtercenterId: [],
      filtersubjectId: []
    })
    this.getTalukas();
    this.getCenters();
    this.getschools();
    this.getBarChartOption();
    this.getdashboardCount();
    this.getSubject();
  }
  ngAfterViewInit(){
   // this.getdashboardCount();

  }
  getTalukas() {
    this.masterService.getAllTaluka().subscribe((res: any) => {
      this.talukaData = res.responseData;
    })
  }
  getCenters() {
    this.masterService.getAllCenter('', (this.f['talukaId'].value|0)).subscribe((res: any) => {
      this.centerData = res.responseData;
    })
  }
  getschools() {
    this.masterService.getAllSchoolsByCenterId('', (this.f['centerId'].value|0)).subscribe((res: any) => {
      this.schoolData = res.responseData;
    })
  }
  getSubject(){
    this.masterService.getAllSubject().subscribe((res: any) => {
      this.subjectData = res.responseData;
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
  getBarChartOption() {
    this.barchartOptions = {
      series:[],
      // series: [
      //   [
      //     [{
      //     name: "PRODUCT A",
      //     data: [44]
      //   },
      //   {
      //     name: "PRODUCT B",
      //     data: [13]
      //   },
      //   {
      //     name: "PRODUCT C",
      //     data: [11]
      //   }],
      //   [{
      //     name: "PRODUCT A",
      //     data: [24]
      //   },
      //   {
      //     name: "PRODUCT B",
      //     data: [10]
      //   },
      //   {
      //     name: "PRODUCT C",
      //     data: [48]
      //   }],
      //   [{
      //     name: "PRODUCT A",
      //     data: [65]
      //   },
      //   {
      //     name: "PRODUCT B",
      //     data: [10]
      //   },
      //   {
      //     name: "PRODUCT C",
      //     data: [37]
      //   }]
      // ],
      //   [[{
      //     name: "PRODUCT A",
      //     data: [65, 36, 25, 15]
      //   },
      //   {
      //     name: "PRODUCT B",
      //     data: [10, 70, 25, 42]
      //   },
      //   {
      //     name: "PRODUCT C",
      //     data: [37, 65, 74, 20]
      //   }]],
      // ],
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
          this.dashboardCountData.push(res.responseData);
          this.tableColumn=[{label:'एकूण संख्या', GroupId:0,  ischeckboxShow:false, status:false},{label:'१ली ते 2री',GroupId:1,  ischeckboxShow:true, status:true},{label:'3री ते ५वी',GroupId:2, ischeckboxShow:true, status:false},{label:'६वी ते ८वी',GroupId:3, ischeckboxShow:true, status:false},];
          this.checkData(this.tableColumn[1]);
          this.getPieChartData();
           } else { 
            this.dashboardCountData=[];
          }
       },
      error: (error:any) => { this.error.handelError(error.message) }
    });
  }
  checkData(obj:any){
    this.tableColumn.map((x:any)=>{
      if(x.status==true){
        x.status= obj.GroupId != x.GroupId? false: obj.status;
      }
    })
    this.getBarChart(obj);
  }
  getPieChartData(){
    const serriesArray= [0,0,0];
    serriesArray[0]= this.dashboardCountData[0].govtSchool|0;
    serriesArray[1]= this.dashboardCountData[0].privateSchool|0;
    serriesArray[2]= this.dashboardCountData[0].otherSchool|0;
    this.piechartOptions.series = serriesArray;
    this.piechartOptions.labels=['Goverment','Private','Other'];
  }

  getBarChart(obj:any){
    const formData= this.filterForm.value;
    this.selectedObj=obj;
    this.barChartData=[];
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/'+(obj.GroupId==1?'GetDataFor1st2ndStd':'GetDataFor3rdAboveStd')+'?TalukaId='+(formData?.talukaId ||0)+'&CenterId='+(formData?.centerId ||0)+'&SchoolId='+(formData?.schoolId ||0)+'&GroupId='+obj?.GroupId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => { 
        if (res.statusCode == "200") {
          this.barChartData=res.responseData.responseData1;
         const subjectSet = [...new Set(this.barChartData.map(sub => sub.subjectName))];
          this.barchartOptions.series=[];
          let dataArray:any[]=[];
          subjectSet.map((x:any)=>{
            const  filterSubject=this.barChartData.filter((y:any)=> y.subjectName==x);
            let dataObjArray:any[]=[];
            filterSubject.map((z:any)=>{
              const subData = {
                name: obj.GroupId==1 ? z.optionName : z.question,
                data: [z.totalStudent]
              }
              dataObjArray.push(subData);
            })
             dataArray.push(dataObjArray);
           })
           this.barchartOptions.series.push(dataArray);
           this.barchartOptions.xaxis.categories=subjectSet;
            this.showBarChartF=true;
          } 
       
       },
      error: (error:any) => { this.error.handelError(error.message) }
    });
    this.getbarChartByTaluka();
  }

  getbarChartByTaluka(){
    const filterformData= this.filterForm.value;
    const formDatafilterbyTaluka= this.filterFormForBarGraph.value;
    this.barChartData=[];
    const TalukaId= filterformData?.talukaId? filterformData?.talukaId :formDatafilterbyTaluka?.filtertalukaId;
    const str= TalukaId?(this.selectedObj.GroupId==1?'GetDataFor1st2ndStdByTaluka':'GetDataFor3rdAboveStdByTaluka'):(this.selectedObj.GroupId==1?'GetDataFor1st2ndStdByCenter':'GetDataFor3rdAboveStdByCenter')
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/'+str+'?TalukaId='+(TalukaId||0)+(!TalukaId?'&CenterId='+(filterformData?.centerId ||0):'')+'&GroupId='+this.selectedObj?.GroupId+ '&', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => { 
        if (res.statusCode == "200") {
          this.barChartByTalukaData=res.responseData.responseData1;
          console.log(this.barChartByTalukaData)
            this.showBarChartF=true;
          } 
       },
      error: (error:any) => { this.error.handelError(error.message) }
    });
  }

}
