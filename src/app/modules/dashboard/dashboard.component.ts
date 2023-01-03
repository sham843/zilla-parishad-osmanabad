import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  get f() { return this.filterForm.controls }
  get fBgraph() { return this.filterFormForBarGraph.controls }
  constructor(public translate: TranslateService, private masterService: MasterService,
    public webStorage: WebStorageService, private fb: FormBuilder, private apiService: ApiService,
    private error: ErrorsService, private commonMethods: CommonMethodsService, private router: Router) {
    this.getBarChartOption();
    this.getPieChart();
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      talukaId: [4],
      centerId: [],
      schoolId: []
    })
    this.filterFormForBarGraph = this.fb.group({
      filtertalukaId: [],
      filtercenterId: [],
      filtersubjectId: []
    })
    this.getTalukas();
    this.getdashboardCount();
    this.getTabledataByTaluka()
  }

  ngAfterViewInit() {
    this.showSvgMap(this.commonMethods.mapRegions());
    this.clickOnSvgMap('select');
  }
  getTalukas() {
    this.talukaData = [];
    this.masterService.getAllTaluka().subscribe((res: any) => {
      this.talukaData.push({ "id": 0, "taluka": "All", "m_Taluka": "सर्व" }, ...res.responseData);
      const obj = this.talukaData.find((x: any) => x.taluka == "Osmanabad")
      this.f['talukaId'].patchValue(obj.id);
      this.getCenters() ;
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
    this.masterService.getAllSchoolsByCenterId('', (this.f['centerId'].value|0)).subscribe((res: any) => {
      this.schoolData = res.responseData;
    })
  }
  getSubject(GroupId: any) {
    this.masterService.GetAllSubjectsByGroupClassId('', GroupId).subscribe((res: any) => {
      this.subjectData = res.responseData;
      this.fBgraph['filtersubjectId'].patchValue(this.subjectData[0].id)
    })
  }
  getPieChart() {
    this.piechartOptions = {
      series: [],
      chart: {
        type: "donut"
      },
      legend: {
        position: "bottom"
      },
      fill: {
        type: "solid",
        colors: ["#00E396", "#F9CE1D", "#D4526E", "#D7263D", "#A300D6"]
      },
      // colors: [],
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
      ]
    };
    this.piechartOptions1 = {
      series: [],
      chart: {
        type: "donut"
      },

      fill: {
        type: "solid",
        colors: ["#00E396", "#F9CE1D", "#D4526E", "#D7263D", "#A300D6"]
      },
      // colors: [],
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
      ]
    };
    this.piechartOptions2 = {
      series: [],
      chart: {
        type: "donut"
      },

      fill: {
        type: "solid",
        colors: ["#00E396", "#F9CE1D", "#D4526E", "#D7263D", "#A300D6"]
      },
      // colors: [],
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
      ]
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
        colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889'],
        // opacity: 1
      },
      legend: {
        position: "bottom",
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
    this.getBarChart(this.selectedObj);
    this.getbarChartByTaluka();

  }
  selectedBar(selectedbar: any) {
    const index = this.barchartOptions.xaxis.categories.findIndex((i: any) => i == selectedbar);
    const data = this.barChartData.find((x: any) => x.m_SubjectName == selectedbar && x.m_OptionName == this.barchartOptions.series[0][index][this.optionalSubjectindex].name);
    const formData = this.filterForm.value
    this.SharingObject = {
      GroupId: this.selectedObj.GroupId,
      TalukaId: formData.talukaId,
      CenterId: formData.centerId,
      SchoolId: formData.schoolId,
      SubjectId: data.subjectId,
      OptionGrade: data.optionGrade
    }
    this.webStorage.selectedBarchartObjData.next(this.SharingObject);
    this.router.navigate(['/dashboard-student-details'])
  }

  getdashboardCount() {
    const formData = this.filterForm.value;
    this.dashboardCountData = [];
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/GetDashboardCount?TalukaId=' + (formData?.talukaId || 0) + '&CenterId=' + (formData?.centerId || 0) + '&SchoolId=' + (formData?.schoolId || 0), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.dashboardCountData.push(res.responseData.responseData1[0]);
          this.totalStudentSurveyData = res.responseData.responseData2;
          this.tableColumn = [{ label: 'एकूण संख्या', GroupId: 0, ischeckboxShow: false, status: false }, { label: '१ली ते 2वी', GroupId: 1, subSTD: [{ label: '१ली', subGroupId: 1, status: false }, { label: '2री', subGroupId: 2, status: false }], ischeckboxShow: true, status: true }, { label: '3री ते ५वी', GroupId: 2, subSTD: [{ label: '3री', subGroupId: 3, status: false }, { label: '4री', subGroupId: 4, status: false }, { label: '5वी', subGroupId: 5, status: false }], ischeckboxShow: true, status: false }, { label: '६वी ते ८वी', GroupId: 3, subSTD: [{ label: '६वी', subGroupId: 6, status: false }, { label: '7वी', subGroupId: 7, status: false }, { label: '८वी', subGroupId: 8, status: false }], ischeckboxShow: true, status: false },];
          this.checkData(this.tableColumn[1]);
          this.getPieChartData();
        } else {
          this.dashboardCountData = [];
        }
      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
  }
  checkData(obj: any) {
    this.tableColumn.map((x: any) => {
      x.status = false;
    })
    const index = this.tableColumn.findIndex((x: any) => x.GroupId == obj.GroupId);
    this.tableColumn[index].status = true;
    // this.tableColumn.map((x:any)=>{
    //   if(x.status==true){
    //     x.status= obj.GroupId == x.GroupId?true:false
    //   }
    // })
    this.getSubject(obj.GroupId);
    this.getBarChart(obj);
    setTimeout(() => {
      this.getbarChartByTaluka();
    }, 100);

  }
  getPieChartData() {
    const serriesArray = [0, 0, 0];
    const serriesArray1 = [0, 0, 0];
    const serriesArray2 = [0, 0, 0];
    serriesArray[0] = this.dashboardCountData[0].govtSchool | 0;
    serriesArray[1] = this.dashboardCountData[0].privateSchool | 0;
    serriesArray[2] = this.dashboardCountData[0].otherSchool | 0;

    serriesArray1[0] = this.dashboardCountData[0].engMedSchool | 0;
    serriesArray1[1] = this.dashboardCountData[0].marMedSchool | 0;
    serriesArray1[2] = this.dashboardCountData[0].bothMedSchool | 0;

    serriesArray2[0] = this.dashboardCountData[0].boyStudent | 0;
    serriesArray2[1] = this.dashboardCountData[0].girlStudent | 0;
    serriesArray2[2] = this.dashboardCountData[0].otherStudent | 0;

    this.piechartOptions.colors = [];
    this.piechartOptions.series = serriesArray;
    this.piechartOptions1.series = serriesArray1;
    this.piechartOptions2.series = serriesArray2;
    this.piechartOptions.labels = ['Goverment', 'Private', 'Other'];
    this.piechartOptions1.labels = ['English-Medium', 'Marathi-Medium', 'Both'];
    this.piechartOptions2.labels = ['Boys', 'Girls', 'Other'];
  }

  getBarChart(obj: any) {
    const formData = this.filterForm.value;
    this.showBarChartF = false;
    this.selectedObj = obj;
    this.barChartData = [];
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/' + (obj.GroupId == 1 ? 'GetDataFor1st2ndStd' : 'GetDataFor3rdAboveStd') + '?TalukaId=' + (formData?.talukaId || 0) + '&CenterId=' + (formData?.centerId || 0) + '&SchoolId=' + (formData?.schoolId || 0) + '&GroupId=' + obj?.GroupId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.barChartData = res.responseData.responseData1;
          const subjectSet = [...new Set(this.barChartData.map(sub => sub.m_SubjectName))];
          this.graphSubjectData = subjectSet;
          this.barchartOptions.series = [];
          this.barchartOptions.xaxis.categories = [];
          let dataArray: any[] = [];
          subjectSet.map((x: any) => {
            const filterSubject = this.barChartData.filter((y: any) => y.m_SubjectName == x);
            let dataObjArray: any[] = [];
            filterSubject.map((z: any) => {
              const subData = {
                name: obj.GroupId == 1 ? z.optionName : z.question,
                data: [z.totalPercental]
              }
              dataObjArray.push(subData);
            })
            dataArray.push(dataObjArray);
          })
          this.barchartOptions.series.push(dataArray);
          this.barchartOptions.xaxis.categories.push(...subjectSet);
          this.showBarChartF = true;
        }

      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
  }

  getbarChartByTaluka() {
    this.showBarChartS = false;
    const filterformData = this.filterForm.value;
    const formDatafilterbyTaluka = this.filterFormForBarGraph.value;
    this.barChartData = [];
    const TalukaId = filterformData?.talukaId ? filterformData?.talukaId : formDatafilterbyTaluka?.filtertalukaId;
    const str = TalukaId ? (this.selectedObj.GroupId == 1 ? 'GetDataFor1st2ndStdByCenter' : 'GetDataFor3rdAboveStdByCenter') : (this.selectedObj.GroupId == 1 ? 'GetDataFor1st2ndStdByTaluka' : 'GetDataFor3rdAboveStdByTaluka');
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/' + str + '?TalukaId=' + (TalukaId || 0) + (TalukaId ? '&CenterId=' + (formDatafilterbyTaluka?.filtercenterId || 0) : '') + '&GroupId=' + this.selectedObj?.GroupId + '&SubjectId=' + (formDatafilterbyTaluka.filtersubjectId | 0), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.barChartByTalukaData = res.responseData.responseData1;
          this.barchartOptions1.series = [];
          this.barchartOptions1.xaxis.categories = [];
          let talukaSet: any = [];
          talukaSet = [...new Set(this.barChartByTalukaData.map(sub => TalukaId ? sub.center : sub.taluka))];
          const subjectSet = [...new Set(this.barChartByTalukaData.map(sub => sub.m_OptionName || sub.m_Question))];
          let arrayObjectData: any[] = [];
          subjectSet.map((x: any) => {
            const filterSubject = this.barChartByTalukaData.filter((y: any) => (y.m_OptionName || y.m_Question) == x);
            const subData = {
              name: x,
              data: filterSubject.map(sub => sub.percentage)
            }
            arrayObjectData.push(subData);
          })
          this.barchartOptions1.series.push(arrayObjectData)
          this.barchartOptions1.xaxis.categories.push(...talukaSet);
          this.showBarChartS=true;
        }

      },
      error: (error: any) => { this.error.handelError(error.message) }
    });
    this.getTabledataByTaluka();
  }

  getTabledataByTaluka() {
    this.tableDataTopPerformance = [];
    const filterformData = this.filterForm.value;
    const formDatafilterbyTaluka = this.filterFormForBarGraph.value;
    this.barChartData = [];
    const TalukaId = filterformData?.talukaId ? filterformData?.talukaId : formDatafilterbyTaluka?.filtertalukaId;
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/GetDataForTopLowSchool' + '?TalukaId=' + (TalukaId || 0) + (TalukaId ? '&CenterId=' + (formDatafilterbyTaluka?.filtercenterId || 0) : ''), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataTopPerformance.push(res.responseData.responseData1);
          this.tableDataTopPerformance.push(res.responseData.responseData2);
          
          this.displayedheaders = ['#','Sr. No.', 'Name', 'Total Student', 'Percetage'];

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
  clickOnSvgMap(flag?: string) {
    if (flag == 'select') {
      let checkTalActiveClass = $('#mapsvg   path').hasClass("talActive");
      checkTalActiveClass ? $('#mapsvg path[id="' + this.globalTalId + '"]').removeAttr("style") : '';
      this.svgMapAddOrRemoveClass();
    }

    $(document).on('click', '#mapsvg  path', (e: any) => {
      let getClickedId = e.currentTarget;
      let talId = $(getClickedId).attr('data-name').split(" ")[0];
      this.filterForm.controls['talukaId'].setValue(+talId);

      this.svgMapAddOrRemoveClass();
      this.dashboardAPis();
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
