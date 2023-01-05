import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
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
export class DashboardComponent implements OnInit, AfterViewInit {
  talukaData = new Array();
  lang !: string;
  schoolData = new Array();
  centerData = new Array();
  subjectData = new Array();
  filterForm!: FormGroup;
  filterFormForBarGraph!: FormGroup;
  piechartOptions: any;
  piechartOptions1: any;
  piechartOptions2: any;
  barchartOptions: any;
  barchartOptions1: any;
  dashboardCountData = new Array();
  tableColumn = new Array();
  barChartData = new Array();
  showBarChartF: boolean = false;
  selectedObj!: object | any;
  barChartByTalukaData = new Array();
  graphInstance: any;
  showBarChartS: boolean = false;
  tableDataTopPerformance = new Array();
  displayedheaders = new Array;
  graphSubjectData = new Array();
  totalStudentSurveyData = new Array();
  optionalSubjectindex!: number;
  SharingObject: any;
  globalTalId: any;
  selectedSurveyData:any;
  standardArray=new Array();
  selectedLang: any;
  enbTalDropFlag:boolean=false;
  standardShowFlag:boolean=false;
  selectedTalukaId:any;
  resetFlag:boolean=false;
  get f() { return this.filterForm.controls }
  get fBgraph() { return this.filterFormForBarGraph.controls }
  constructor(public translate: TranslateService, private masterService: MasterService,
    public webStorage: WebStorageService, private fb: FormBuilder, private apiService: ApiService,
    private error: ErrorsService, private commonMethods: CommonMethodsService,
    // private router: Router
     ) {
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolId: []
    })
    this.filterFormForBarGraph = this.fb.group({
      filtertalukaId: [0],
      filtercenterId: [0],
      filtersubjectId: []
    })
    this.getBarChartOption();
    this.getPieChart();
    this.webStorage.langNameOnChange.subscribe((lang) => {
      this.selectedLang = lang;
       this.showSvgMap(this.commonMethods.mapRegions());
       this.getPieChartData();
       this.constructBarChart();
       this.selectedObj?this.getbarChartByTaluka():'';
       setTimeout(()=>{
        this.clickOnSvgMap('select');
       },70)
    });
    this.getTalukas();
    this.getdashboardCount();
    this.getTabledataByTaluka()
  }

  ngAfterViewInit() {
    this.showSvgMap(this.commonMethods.mapRegions());
    this.clickOnSvgMap();
  }
  getTalukas() {
    this.talukaData = [];
    this.masterService.getAllTaluka().subscribe((res: any) => {
      this.talukaData.push({ "id": 0, "taluka": "All", "m_Taluka": "सर्व" }, ...res.responseData);
    })
  }
  getCenters() {
    this.centerData = [];
    this.masterService.getAllCenter('', (this.f['talukaId'].value | 0)).subscribe((res: any) => {
      this.centerData.push({ "id": 0, "center": "All", "m_Center": "सर्व" }, ...res.responseData);
      this.f['centerId'].patchValue(0);
    })
  }
  getschools() {
    this.fBgraph['filtercenterId'].patchValue(this.f['centerId'].value)
    this.masterService.getAllSchoolByCriteria('',(this.f['talukaId'].value|0),0, (this.f['centerId'].value|0)).subscribe((res: any) => {
      this.schoolData = res.responseData;
    })
  }
  getSubject(groupId: any) {
    this.masterService.GetAllSubjectsByGroupClassId('', groupId).subscribe((res: any) => {
      this.subjectData = res.responseData;
      this.fBgraph['filtersubjectId'].patchValue(this.subjectData[0].id);
      setTimeout(()=>{
        this.getbarChartByTaluka();
      },100)
      
    })
  }
  getPieChart() {
    this.piechartOptions = {
      series: [],
      chart: {
        type: "donut"
      },
      fill: {
        type: "solid",
        colors: ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63' ],
      },
      colors: ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
      labels: [],
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
      ],
      legend: {
        position: 'right',
        fontSize: '12px',
        show: true,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
        }
      }
    };
    this.piechartOptions1 = {
      series: [],
      chart: {
        type: "donut"
      },

      fill: {
        type: "solid",
        colors:['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
      },
      colors:['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
      labels: [],
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
      ],
      legend: {
        position: 'right',
        fontSize: '12px',
        show: true,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
        }
      }
    };
    this.piechartOptions2 = {
      series: [],
      chart: {
        type: "donut"
      },
      colors: ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
      fill: {
        type: "solid",
        colors:['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
      },
      labels: [],
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
      ],
      legend: {
        position: 'right',
        fontSize: '12px',
        show: true,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'],
        }
      }
    };
  }
  getBarChartOption() {
    
    this.barchartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 420,
        width: 300,
        horizontal: false,
        borderRadius: 10, 
        columnWidth: '45%',
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false
        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            console.log(event, chartContext)
            this.optionalSubjectindex = config.seriesIndex;
          }
        }
      },
      // theme: {
      //   monochrome: {
      //     enabled: true,
      //     color: '#434AB3',
      //     shadeTo: 'light',
      //     shadeIntensity: 0.65
      //   }
      // },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889'],
            }
          }
        }
      ],
      xaxis: {
        labels: {
          show: false,
        },
        categories: [
        ],
        parameters:[]
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
        colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889'],
        // opacity: 1
      },
      legend: {
        position: 'right',
        fontSize: '12px',
        show: true,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889', '#73AFFE'],
        }
      }
    };


    this.barchartOptions1 = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        width: '100%',
        columnWidth: '50%',
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
              colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889'],
              position: "bottom",
              offsetX: 0,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            fontFamily: 'Noto Sans Devanagari, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        categories: [
        ],
        parameters:[]
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
        colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889'],
        opacity: 1
      },
      legend: {
        position: 'bottom',
        fontSize: '12px',
        show: true,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889', '#73AFFE'],
        }
      }
    };
  }
  dashboardAPis() {
    this.getdashboardCount();
    this.getbarChartByTaluka();

  }
  selectedBar(selectedbar: any) {
    const index = this.barchartOptions.xaxis.categories.findIndex((i: any) => i == selectedbar);
    const data = this.barChartData.find((x: any) => x.m_SubjectName == selectedbar && x.m_OptionName == this.barchartOptions.series[0][index][this.optionalSubjectindex].name);
    const formData = this.filterForm.value
    this.SharingObject = {
      groupId: this.selectedObj?.groupId|0,
      TalukaId: formData?.talukaId|0,
      CenterId: formData?.centerId|0,
      SchoolId: formData?.schoolId|0,
      SubjectId: data?.subjectId|0,
      OptionGrade: data?.optionGrade|0
    }
    this.webStorage.selectedBarchartObjData.next(this.SharingObject);
    localStorage.setItem('selectedBarchartObjData',JSON.stringify(this.SharingObject))
    // this.router.navigate(['/dashboard-student-details'])
  }

  getdashboardCount() {
    const formData = this.filterForm.value;
    this.dashboardCountData = [];
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/GetDashboardCount?TalukaId=' + (formData?.talukaId || 0) + '&CenterId=' + (formData?.centerId || 0) + '&SchoolId=' + (formData?.schoolId || 0), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.dashboardCountData.push(res.responseData.responseData1[0]);
          this.totalStudentSurveyData =res.responseData.responseData2;
          this.totalStudentSurveyData.map((x:any)=>{
            x.status = true;
            x.ischeckboxShow=true})
          this.totalStudentSurveyData[1].status = true;
          this.totalStudentSurveyData[0].ischeckboxShow=false;
          // this.tableColumn = [{ label: 'एकूण संख्या', groupId: 0, ischeckboxShow: false, status: false }, { label: '१ली ते 2वी', groupId: 1, subSTD: [{ label: '१ली', subgroupId: 1, status: false }, { label: '2री', subgroupId: 2, status: false }], ischeckboxShow: true, status: true }, { label: '3री ते ५वी', groupId: 2, subSTD: [{ label: '3री', subgroupId: 3, status: false }, { label: '4री', subgroupId: 4, status: false }, { label: '5वी', subgroupId: 5, status: false }], ischeckboxShow: true, status: false }, { label: '६वी ते ८वी', groupId: 3, subSTD: [{ label: '६वी', subgroupId: 6, status: false }, { label: '7वी', subgroupId: 7, status: false }, { label: '८वी', subgroupId: 8, status: false }], ischeckboxShow: true, status: false },];
          this.checkData(this.totalStudentSurveyData[1], 'radio');
          this.getPieChartData();
        } else {
          this.dashboardCountData = [];
          this.totalStudentSurveyData= [];
        }
      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
  }
  checkData(obj: any, status:any,) {
    if(status=='radio'){
      this.totalStudentSurveyData.map((x: any) => {
        x.status = false;
      })
      const index = this.totalStudentSurveyData.findIndex((x: any) => x.groupId == obj.groupId);
      this.totalStudentSurveyData[index].status = true;
      this.totalStudentSurveyData.map((x:any)=>{
        if(x.status==true){
          x.standardDetails.map((y:any)=>{
            y.status=true;
          })
          this.standardArray=x.standardDetails.filter((y:any)=> y.status==true);
        }
      })
      
    }
    setTimeout(()=>{
      this.totalStudentSurveyData.forEach((x:any)=>{
        if(x.status==true){
          this.standardArray=x.standardDetails.filter((y:any)=> y.status==true);
          if(this.standardArray.length){
            let studentTotal=0;
            let assessmentTotal=0;
            this.selectedSurveyData=[];
            this.standardArray.forEach((y:any)=>{
              studentTotal += y.studentCount,
              assessmentTotal += y.assessmentCount
            })
            this.selectedSurveyData=assessmentTotal+'/'+studentTotal;
          }else{
            this.selectedSurveyData=x.assessmentCount+'/'+x.studentCount;
            this.standardArray=x.standardDetails;
          }
        }
      })
    },50)
    this.getSubject(obj.groupId);
    setTimeout(() => {
    this.getBarChart(obj);
    }, 50);

  }
  getPieChartData() {
    const serriesArray = [0, 0, 0];
    const serriesArray1 = [0, 0, 0];
    const serriesArray2 = [0, 0, 0];
    serriesArray[0] = this.dashboardCountData[0]?.govtSchool | 0;
    serriesArray[1] = this.dashboardCountData[0]?.privateSchool | 0;
    serriesArray[2] = this.dashboardCountData[0]?.otherSchool | 0;

    serriesArray1[0] = this.dashboardCountData[0]?.engMedSchool | 0;
    serriesArray1[1] = this.dashboardCountData[0]?.marMedSchool | 0;
    serriesArray1[2] = this.dashboardCountData[0]?.bothMedSchool | 0;

    serriesArray2[0] = this.dashboardCountData[0]?.boyStudent | 0;
    serriesArray2[1] = this.dashboardCountData[0]?.girlStudent | 0;
    serriesArray2[2] = this.dashboardCountData[0]?.otherStudent | 0;

    this.piechartOptions.colors = ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'];
    this.piechartOptions1.colors = ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'];
    this.piechartOptions2.colors = ['#E98754', '#EFB45B', '#65C889','#CB4B4B', '#E76A63'];
    this.piechartOptions.series = serriesArray;
    this.piechartOptions1.series = serriesArray1;
    this.piechartOptions2.series = serriesArray2;
    this.piechartOptions.labels = this.selectedLang == 'English' ? ['Goverment', 'Private', 'Other']:['सरकारी', 'खाजगी', 'इतर'] ;
    this.piechartOptions1.labels = this.selectedLang == 'English' ? ['English-Medium', 'Marathi-Medium', 'Both']:['इंग्रजी-माध्यम', 'मराठी-माध्यम', 'दोन्ही'];
    this.piechartOptions2.labels = this.selectedLang == 'English' ? ['Boys', 'Girls', 'Both']:['मुले', 'मुली', 'दोन्ही'];
  }

  getBarChart(obj: any) {
    const formData = this.filterForm.value;
    this.showBarChartF = false;
    this.selectedObj = obj;
    this.barChartData = [];
    const standardData=this.standardArray.map((x:any)=> x.standardId );
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/' + (obj.groupId == 1 ? 'GetDataFor1st2ndStdForBarChart' : 'GetDataFor3rdAboveStdForBarChart') + '?TalukaId=' + (formData?.talukaId || 0) + '&CenterId=' + (formData?.centerId || 0) + '&SchoolId=' + (formData?.schoolId || 0) + '&groupId=' + obj?.groupId+'&StandardIds='+standardData.toString(), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.barChartData = res.responseData.responseData1;
          this.constructBarChart();
        }
      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
  }
  constructBarChart(){
    const subjectSet = [...new Set(this.barChartData.map(sub => sub.subjectName))];
    const subjectSet_m = [...new Set(this.barChartData.map(sub => sub.m_SubjectName))];
    this.graphSubjectData = this.selectedLang == 'English' ? subjectSet: subjectSet_m;
    this.barchartOptions.series = [];
    this.barchartOptions.xaxis.categories = [];
    let dataArray: any[] = [];
    subjectSet.map((x: any) => {
      const filterSubject = this.barChartData.filter((y: any) => y.subjectName == x);
      let dataObjArray: any[] = [];
      filterSubject.map((z: any) => {
        const subData = {
          name: this.selectedLang == 'English' ?(this.selectedObj.groupId == 1 ? z.optionName : z.question):(this.selectedObj.groupId == 1 ? z.m_OptionName : z.m_Question),
          data: ([Math.round(z.totalPercental) | Math.round(z.percentage)])
        }
        dataObjArray.push(subData);
      })
      dataArray.push(dataObjArray);
    })
    this.barchartOptions.series.push(dataArray);
    this.barchartOptions.xaxis.categories.push(...(this.selectedLang == 'English' ? subjectSet: subjectSet_m));
    this.barchartOptions.xaxis.parameters= this.selectedLang == 'English' ?['Level','Percentage']:['स्तर','टक्केवारी']
    this.showBarChartF = true;
    
    this.barchartOptions.tooltip = {
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {              
        return (
          '<div class="arrow_box" style="padding:10px;">' +
            "<div>" + w.config.xaxis.parameters[0]+ " : <b> " + w.globals.seriesNames[seriesIndex]+ '</b>' + "</div>" +
            "<div>" + w.config.xaxis.parameters[1] + " : <b> " + series[seriesIndex][dataPointIndex] + '%</b>' + "</div>" +
          "</div>"
        );
      },
    }
  }

  getbarChartByTaluka() {
    this.showBarChartS = false;
    const filterformData = this.filterForm.value;
    const formDatafilterbyTaluka = this.filterFormForBarGraph.value;
    this.selectedTalukaId = filterformData?.talukaId ? filterformData?.talukaId : formDatafilterbyTaluka?.filtertalukaId;
    const str = this.selectedTalukaId ? (this.selectedObj.groupId == 1 ? 'GetDataFor1st2ndStdByCenter' : 'GetDataFor3rdAboveStdByCenter') : (this.selectedObj?.groupId == 1 ? 'GetDataFor1st2ndStdByTaluka' : 'GetDataFor3rdAboveStdByTaluka');
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/' + str + '?TalukaId=' + (this.selectedTalukaId || 0) + (this.selectedTalukaId ? '&CenterId=' + (formDatafilterbyTaluka?.filtercenterId || 0) : '') + '&groupId=' + this.selectedObj?.groupId + '&SubjectId=' + (formDatafilterbyTaluka.filtersubjectId | 0), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.barChartByTalukaData = res.responseData.responseData1;
        this.constructBarChartByTaluka();
        }
      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
    this.getTabledataByTaluka();
  }
  constructBarChartByTaluka(){
    this.barchartOptions1.series = [];
    this.barchartOptions1.xaxis.categories = [];
    let talukaSet: any = [];
    let talukaSet_m: any = [];
    talukaSet = [...new Set(this.barChartByTalukaData.map(sub => this.selectedTalukaId ? sub.center : sub.taluka))];
    talukaSet_m = [...new Set(this.barChartByTalukaData.map(sub => this.selectedTalukaId ? sub.m_Center : sub.m_Taluka))];
    const subjectSet = [...new Set(this.barChartByTalukaData.map(sub => sub.optionName || sub.question))];
    const subjectSet_m = [...new Set(this.barChartByTalukaData.map(sub => sub.m_OptionName || sub.m_Question))];
    let arrayObjectData: any[] = [];
    subjectSet.map((x: any, index:any) => {
      const filterSubject = this.barChartByTalukaData.filter((y: any) => (y.optionName || y.question) == x);
      const subData = {
        name: this.selectedLang == 'English'? x:subjectSet_m[index],
        data: filterSubject.map(sub => sub.percentage)
      }
      arrayObjectData.push(subData);
    })
    this.barchartOptions1.series.push(arrayObjectData);
    this.barchartOptions1.xaxis.categories.push(...(this.selectedLang == 'English' ?talukaSet:talukaSet_m));
    this.barchartOptions1.xaxis.parameters= this.selectedLang == 'English' ?['Level','Percentage']:['स्तर','टक्केवारी']
    this.showBarChartS = true;
    
    this.barchartOptions1.tooltip = {
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {              
        return (
          '<div class="arrow_box" style="padding:10px;">' +
            "<div>" + w.config.xaxis.parameters[0]+ " : <b> " + w.globals.seriesNames[seriesIndex]+ '</b>' + "</div>" +
            "<div>" + w.config.xaxis.parameters[1] + " : <b> " + series[seriesIndex][dataPointIndex] + '%</b>' + "</div>" +
          "</div>"
        );
      },
    }
  };
  getTabledataByTaluka() {
    const filterformData = this.filterForm.value;
    const formDatafilterbyTaluka = this.filterFormForBarGraph.value;
    const TalukaId = filterformData?.talukaId ? filterformData?.talukaId : formDatafilterbyTaluka?.filtertalukaId;
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/GetDataForTopLowSchool' + '?TalukaId=' + (TalukaId || 0) + (TalukaId ? '&CenterId=' + (formDatafilterbyTaluka?.filtercenterId || 0) : ''), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataTopPerformance = [];
          this.tableDataTopPerformance.push(res.responseData.responseData1);
          this.tableDataTopPerformance.push(res.responseData.responseData2);
          this.displayedheaders = [{label:'#', m_label:'#'}, {label:'School Name', m_label:'शाळेचे नाव'}, {label:'Total Student', m_label:'एकूण विद्यार्थी'}, {label:'Percetage', m_label:'टक्केवारी'}];
        }
        else {
          this.tableDataTopPerformance = [];
        }
      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
  }

  //---------------------------- svg Map ------------------------//
  showSvgMap(data: any) {
    this.graphInstance ? this.graphInstance.destroy() : '';
    //let createMap: any = document.getElementById("#mapsvg");

    this.graphInstance = $("#mapsvg").mapSvg({
      width: 550,
      height: 430,
      colors: {
        baseDefault: "#005f57",
        background: "#fff",
        selected: "#005f57",
        hover: "#005f57",
        directory: "#005f57",
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
      source: this.selectedLang == 'English' ? "assets/distSVG/Osmanabad.svg" : "assets/distSVG/Osmanabad_Marathi.svg",
      title: "Osmanabad_Dist",
      responsive: true
    });
  }
  clickOnSvgMap(flag?: string) {
    if (flag == 'select') {
      //this.enbTalDropFlag ? $('#mapsvg path').addClass('disabledAll'): '';
      let checkTalActiveClass = $('#mapsvg   path').hasClass("talActive");
      checkTalActiveClass ? $('#mapsvg path[id="' + this.globalTalId + '"]').removeAttr("style") : '';
      this.svgMapAddOrRemoveClass();
    }

    $(document).on('click', '#mapsvg  path', (e: any) => {
      let getClickedId = e.currentTarget;
      let talId = $(getClickedId).attr('data-name').split(" ")[0];
      this.filterForm.controls['talukaId'].setValue(+talId);

      this.svgMapAddOrRemoveClass();
      this.dashboardAPis(),this.getCenters()
    })
  }

  svgMapAddOrRemoveClass() {
    let checkTalActiveClass = $('#mapsvg   path').hasClass("talActive");
    checkTalActiveClass ? $('#mapsvg   path#' + this.globalTalId).removeClass("talActive") : '';
    this.talukaData.find(() => {
      this.globalTalId = this.filterForm?.value?.talukaId;
      $('#mapsvg path[id="' + this.filterForm?.value?.talukaId + '"]').addClass('talActive');
    });
  }

}
