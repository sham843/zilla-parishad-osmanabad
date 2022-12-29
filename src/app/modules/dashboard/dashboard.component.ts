import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
declare var $: any;
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
  graphInstance: any;
  showBarChartS:boolean=false;
  get f() { return this.filterForm.controls }
  get fBgraph() { return this.filterFormForBarGraph.controls}
  constructor(public translate: TranslateService, private masterService: MasterService,
    public webStorage: WebStorageService, private fb: FormBuilder, private apiService:ApiService,
    private error:ErrorsService, private commonMethods:CommonMethodsService) {
    this.getBarChartOption();
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
    this.getdashboardCount();
  }
  ngAfterViewInit() {
    this.showSvgMap(this.commonMethods.mapRegions());
    $(document).on('click', '#mapsvg  path', (e: any) => {
      let getClickedId = e.currentTarget;
      let distrctId = $(getClickedId).attr('id');
      console.log(distrctId);
    })
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
  getSubject(GroupId:any){
    this.masterService.  GetAllSubjectsByGroupClassId('', GroupId).subscribe((res: any) => {
      this.subjectData = res.responseData;
      this.fBgraph['filtersubjectId'].patchValue(this.subjectData[0].id)
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
      //series:[],
      series: [
        [
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
          data: [65]
        },
        {
          name: "PRODUCT B",
          data: [10]
        },
        {
          name: "PRODUCT C",
          data: [37]
        }]
      ],
        
      [
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
        data: [65]
      },
      {
        name: "PRODUCT B",
        data: [10]
      },
      {
        name: "PRODUCT C",
        data: [37]
      }]
    ]
     
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
    this.getSubject(obj.GroupId);
    this.getBarChart(obj);
    setTimeout(() => {
      this.getbarChartByTaluka();
    }, 100);
    
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
                data: [z.totalPercental]
              }
              dataObjArray.push(subData);
            })
             dataArray.push(dataObjArray);
           })
           this.barchartOptions.series.push(dataArray);
           this.barchartOptions.xaxis.categories.push(subjectSet);
            this.showBarChartF=true;
          } 
       
       },
      error: (error:any) => { this.error.handelError(error.message) }
    });
  }

  getbarChartByTaluka(){
    const filterformData= this.filterForm.value;
    const formDatafilterbyTaluka= this.filterFormForBarGraph.value;
    this.barChartData=[];
    const TalukaId= filterformData?.talukaId? filterformData?.talukaId :formDatafilterbyTaluka?.filtertalukaId;
    // const CenterId= filterformData?.centerId? filterformData?.talukaId :formDatafilterbyTaluka?.filtercenterId;
    const str= TalukaId?(this.selectedObj.GroupId==1?'GetDataFor1st2ndStdByCenter':'GetDataFor3rdAboveStdByCenter'):(this.selectedObj.GroupId==1?'GetDataFor1st2ndStdByTaluka':'GetDataFor3rdAboveStdByTaluka');
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/'+str+'?TalukaId='+(TalukaId||0)+(!TalukaId?'&CenterId='+(filterformData?.centerId ||0):'')+'&GroupId='+this.selectedObj?.GroupId+ '&SubjectId='+(formDatafilterbyTaluka.filtersubjectId|0), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => { 
        if (res.statusCode == "200") {
          this.barChartByTalukaData = res.responseData.responseData1;
          const talukaSet = [...new Set(this.barChartByTalukaData.map(sub => (TalukaId || filterformData?.filtercenterId) ? sub.center : sub.taluka))];
          const subjectSet = [...new Set(this.barChartByTalukaData.map(sub => sub.m_OptionName))];
          let arrayObjectData:any[]=[];
          subjectSet.map((x: any) => {
            const filterSubject = this.barChartByTalukaData.filter((y: any) => y.m_OptionName == x);
            //const dataset(filterSubject.map(sub => sub.percentage))]
            //console.log(dataset)
            const subData = {
              name: x,
              data: filterSubject.map(sub => sub.percentage)
            }
            arrayObjectData.push(subData);
          })
          this.barchartOptions.series.push(arrayObjectData)
          this.barchartOptions.xaxis.categories.push(talukaSet);
          this.showBarChartS=true;
          console.log(this.barchartOptions)
        }

      },
      error: (error:any) => { this.error.handelError(error.message) }
    });
  }


  //---------------------------- svg Map ------------------------//
  showSvgMap(data: any) {
    this.graphInstance ? this.graphInstance.destroy() : '';
    let createMap: any = document.getElementById("#mapsvg");

    this.graphInstance = createMap?.mapSvg({
      width: 550,
      height: 430,
      colors: {
        baseDefault: "#bfddff",
        background: "#fff",
        selected: "#272848",
        hover: "#ebebeb",
        directory: "#bfddff",
        status: {}
      },
      regions: data,
      viewBox: [0, 0, 763.614, 599.92],
      cursor: "pointer",
      zoom: {
        on: false,
        limit: [0, 50],
        delta: 2,
        buttons: {
          on: true,
          location: "left"
        },
        mousewheel: true
      },
      tooltips: {
        mode: "title",
        off: true,
        priority: "local",
        position: "bottom"
      },
      popovers: {
        mode: "on",
        on: false,
        priority: "local",
        position: "top",
        centerOn: false,
        width: 300,
        maxWidth: 50,
        maxHeight: 50,
        resetViewboxOnClose: false,
        mobileFullscreen: false
      },
      gauge: {
        on: false,
        labels: {
          low: "low",
          high: "high"
        },
        colors: {
          lowRGB: {
            r: 211,
            g: 227,
            b: 245,
            a: 1
          },
          highRGB: {
            r: 67,
            g: 109,
            b: 154,
            a: 1
          },
          low: "#d3e3f5",
          high: "#436d9a",
          diffRGB: {
            r: -144,
            g: -118,
            b: -91,
            a: 0
          }
        },
        min: 0,
        max: false
      },
      source: "assets/distSVG/Osmanabad.svg",
      title: "Osmanabad_Dist",
      responsive: true
    });
  }

}
