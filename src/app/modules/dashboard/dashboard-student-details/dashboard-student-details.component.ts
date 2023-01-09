import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-dashboard-student-details',
  templateUrl: './dashboard-student-details.component.html',
  styleUrls: ['./dashboard-student-details.component.scss']
})
export class DashboardStudentDetailsComponent {
  pageNumber: number = 1;
  tableDataArray = new Array();
  totalCount!: number;
  tableDatasize!: Number;
  languageFlag!: string;
  data: any;
  dashboardObj: any
  talukaArr: any = []
  centerArr: any = []
  schoolArr: any = []
  standardArr: any = [];
  subjectArr: any = [];
  groupByClassArray: any = [];
  lineChartOptions: any;
  grapbhDetailsArray = new Array();
  displayedColumns = ['docPath', 'srNo', 'fullName', 'actualGrade'];
  marathiDisplayedColumns = ['docPath', 'srNo', 'm_FullName', 'actualGrade'];
  displayedheaders = ['#', 'Sr. No.', 'Name', 'Status'];
  marathiDisplayedheaders = ['#', 'अनुक्रमांक', 'नाव', 'स्तर'];
  filterForm!: FormGroup
  subjectArray = new Array();
  subjectControl = new FormControl('');
  lang!: string;
  showLineChart: boolean = false;
  groupID: any;
  constructor(
    private fb: FormBuilder,
    private ngxSpinner: NgxSpinnerService,
    private apiService: ApiService,
    private webService: WebStorageService,
    private errors: ErrorsService,
    public validators: ValidationService,
    public translate: TranslateService,
    private commonMethods: CommonMethodsService,
    private masterService: MasterService,
  ) {

  }
  ngOnInit() {
    this.dashboardObj = JSON.parse(localStorage.getItem('selectedBarchartObjData') || '');
    this.formData();
    this.languageChange();
    this.getTaluka();
    this. getGroupIdByTalukaCenterSchool();
  }

  formData() {
    this.filterForm = this.fb.group({
      talukaId: [0],
      centerId: [0],
      schoolId: [0],
      groupByClass:[0],
      standardId: [0],
      subjectId: [0]
    })

  }
  languageChange() {
    this.webService.langNameOnChange.subscribe(lang => {
      this.languageFlag = lang;
      this.getTableData();
      //this.getSubjectData();
    });

  }

  setTableData() {
    let tableData = {
      pageNumber: this.pageNumber,
      img: 'docPath', blink: true, badge: '', isBlock: '', pagintion: false, status: 'actualGrade',
      displayedColumns: this.languageFlag == 'English' ? this.displayedColumns : this.marathiDisplayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      tableHeaders: this.languageFlag == 'English' ? this.displayedheaders : this.marathiDisplayedheaders
    };
    this.apiService.tableData.next(tableData);
  }


  getTableData(flag?: any) {
    this.ngxSpinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber
    let TalukaId = flag == 'filter' ? this.filterForm.value?.talukaId : this.dashboardObj?.TalukaId;
    let CenterId = flag == 'filter' ? this.filterForm.value?.centerId : this.dashboardObj?.CenterId;
    let SchoolId = flag == 'filter' ? this.filterForm.value?.schoolId : this.dashboardObj?.SchoolId;
    let StandardId = flag == 'filter' ? this.filterForm.value?.standardId : this.dashboardObj?.StandardId;
    let SubjectId = flag == 'filter' ? this.filterForm.value?.subjectId : this.dashboardObj?.SubjectId;
    let lan = this.webService.languageFlag;
    let GroupId = this.groupID ? this.groupID : this.dashboardObj ? this.dashboardObj?.groupId : 1;

    let studentApi = GroupId == 1 ? 'GetDataFor1st2ndStdStudentList' : 'GetDataFor3rdAboveStdStudentList'
    let str = 'zp-osmanabad/Dashboard/' + studentApi + '?GroupId=' + GroupId + '&TalukaId=' + (TalukaId || 0) + '&CenterId=' + (CenterId || 0) + '&SchoolId=' + (SchoolId || 0) + '&SubjectId=' + (SubjectId || 0) + '&OptionGrade='+this.dashboardObj?.OptionGrade || 0+'&StandardId=' + (StandardId || 0) + '&lan=' + lan

    this.apiService.setHttp('GET', str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.responseData.responseData1.length) {
          this.ngxSpinner.hide();
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData?.responseData2?.pageCount || 0;
          let obj = this.tableDataArray[0];
          this.getLineChartDetails(obj);
          this.data = {
            headerImage: obj.profilePhoto,
            header: this.webService.languageFlag == 'mr-IN' ? obj.m_FullName : obj.fullName,
            subheader: this.webService.languageFlag == 'mr-IN' ? obj.m_Gender : obj.gender,
            labelHeader: this.webService.languageFlag == 'mr-IN' ? ['वडीलांचे नावं', 'पालक मोबाईल क्र.', 'आधार क्र.', 'इयत्ता', 'शाळेचे नाव'] : ['Father Name', 'Parent Mobile No.', 'Aadhar No.', 'Standard', 'School Name'],
            labelKey: this.webService.languageFlag == 'mr-IN' ? ['m_FatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'm_SchoolName'] : ['fatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'schoolName'],
            Obj: obj,
            chart: false
          }
        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
          this.data = ''
        }
        this.setTableData();

      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err.statusCode) })
    });
  }

  viewDetails(obj: any) {
    this.data = {
      headerImage: obj.profilePhoto,
      header: this.webService.languageFlag == 'EN' ? obj.fullName : obj.m_FullName,
      subheader: this.webService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
      labelHeader: this.webService.languageFlag == 'EN' ? ['Father Name', 'Parent Mobile No.', 'Aadhar No.', 'Standard', 'School Name'] : ['वडीलांचे नावं', 'पालक मोबाईल क्र.', 'आधार क्र.', 'इयत्ता', 'शाळेचे नाव'],
      labelKey: this.webService.languageFlag == 'EN' ? ['fatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'schoolName'] : ['m_FatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'm_SchoolName'],
      Obj: obj,
      chart: false
    }
  }


  getTaluka() {
    this.talukaArr = [];
    this.masterService.getAllTaluka(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr.push({ "id": 0, "taluka": "All", "m_Taluka": "सर्व" }, ...res.responseData);
          this.filterForm.controls['talukaId'].setValue(0);
          this.dashboardObj ? (this.filterForm.controls['talukaId'].setValue(this.dashboardObj?.TalukaId), this.getAllCenter()) : this.getAllCenter();
          // this.talukaArr = res.responseData;
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.talukaArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getAllCenter() {
    this.centerArr = [];
    let Tid = this.filterForm.value.talukaId;
    if(Tid !=0){
      this.masterService.getAllCenter(this.languageFlag, Tid).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.centerArr.push({ "id": 0, "center": "All", "m_Center": "सर्व" }, ...res.responseData);
            this.filterForm.controls['centerId'].setValue(0);
            this.dashboardObj ? (this.filterForm.controls['centerId'].setValue(this.dashboardObj?.CenterId), this.getAllSchoolsByCenterId()) : this.getAllSchoolsByCenterId();
          } else {
            this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
            this.centerArr = [];
          }
        },
        error: ((err: any) => { this.errors.handelError(err.statusCode) })
      });
    }
  }

  getAllSchoolsByCenterId() {
    this.schoolArr = [];
    let Tid = this.filterForm.value.talukaId;
    let Cid = this.filterForm.value.centerId;
    console.log(this.filterForm.value.talukaId,this.filterForm.value.centerId);
    
    if(Cid !=0){
      this.masterService.getAllSchoolByCriteria(this.languageFlag, Tid, 0, Cid).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.schoolArr.push({ "id": 0, "schoolName": "All", "m_SchoolName": "सर्व" }, ...res.responseData);
            this.filterForm.controls['schoolId'].setValue(0);
            this.dashboardObj ? this.filterForm.controls['schoolId'].setValue(this.dashboardObj?.SchoolId) : '';
          } else {
            // this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
            this.schoolArr = [];
          }
        },
        error: ((err: any) => { this.errors.handelError(err.statusCode) })
      });
    }
  }

  getGroupIdByTalukaCenterSchool(){   
    this.groupByClassArray = [];
      let formData = this.filterForm.value;
      this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/GetDashboardCount?TalukaId=' + (formData?.talukaId || 0) + '&CenterId=' + (formData?.centerId || 0) + '&SchoolId=' + (formData?.schoolId || 0), false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
           this.groupByClassArray = res.responseData.responseData2;
           this.dashboardObj ? (this.filterForm.controls['groupByClass'].setValue(this.dashboardObj?.groupId),this.getStandard(),this.getSubject()) : '';
          } else {
            this.groupByClassArray = [];
          }
        },
        error: (err: any) => { this.errors.handelError(err.statusCode);}
      });
   
  }

  getStandard() {
    this.groupID = this.filterForm.value.groupByClass;
    this.standardArr = [];
    let groupId = this.groupID ? this.groupID : this.dashboardObj.groupId;
    this.masterService.getAllStandard(groupId,this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.standardArr.push({ "id": 0, "standard": "All", "m_Standard": "सर्व" }, ...res.responseData);
          this.filterForm.controls['standardId'].setValue(0);
          this.dashboardObj ? this.filterForm.controls['standardId'].setValue(this.dashboardObj?.standardArray[0] ) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.standardArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }


  getSubject() {
    this.subjectArr = [];
    let groupId = this.groupID ? this.groupID : this.dashboardObj.groupId;
    this.masterService.GetAllSubjectsByGroupClassId(this.languageFlag,groupId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.subjectArr.push({ "id": 0, "subjectName": "All", "m_SubjectName": "सर्व" }, ...res.responseData);
          this.filterForm.controls['subjectId'].setValue(0);
          this.dashboardObj ? this.filterForm.controls['subjectId'].setValue(this.dashboardObj?.SubjectId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.subjectArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  clearDropdown(name?: any) {
    this.dashboardObj='';
    if (name == 'talukaId') {
      this.filterForm.controls['centerId'].setValue('');
      this.filterForm.controls['schoolId'].setValue('');
    } else if (name == 'centerId') {
      this.filterForm.controls['schoolId'].setValue('');
    }
  }

  childTableCompInfo(obj: any) {
    switch (obj.label) {
      case 'View':
        this.viewDetails(obj);
        this.getLineChartDetails(obj);
        break;
    }
  }

  clearForm() {
    this.filterForm.reset();
    this.dashboardObj = '';
    this.schoolArr=[];
    this.standardArr = [];
    this.subjectArr = [];
    this.getTaluka();
    this.getTableData();
  }

  getLineChartDetails(obj: any) {
    const objData = {
      objData: obj,
      groupId: this.groupID | 0
    }
    this.webService.selectedLineChartObj.next(JSON.stringify(objData));


    //   let str= this.dashboardObj?.groupId==1? 'GetDataFor1st2ndStdStudentChart':'GetDataFor3rdAboveStdStudentChart';
    //   this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/' + str+ '?GroupId='+this.dashboardObj?.groupId+'&StudentId='+obj?.studentId, false, false, false, 'baseUrl');
    //   this.apiService.getHttp().subscribe({
    //     next: (res: any) => {
    //       if (res.statusCode == 200 && res.responseData.responseData1.length) {
    //        this.grapbhDetailsArray=res.responseData.responseData1 ;
    //        this.getSubjectData();
    //       } else {
    //         this.grapbhDetailsArray=[];
    //         this.subjectArray=[];
    //       }
    //     },
    //     error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err.statusCode) })
    //   });
  }
  // getSubjectData() {
  //   this.subjectArray = [];
  //   this.subjectArray = [...new Set(this.grapbhDetailsArray.map((sub: any) => this.languageFlag=='English'? sub.subjectName:sub.m_SubjectName))];
  //   this.subjectControl.patchValue(this.subjectArray[0]);
  //    this.constuctLineChart();
  // }
  // constuctLineChart(){
  //   this.showLineChart=false;
  //     const ExamType = [...new Set(this.grapbhDetailsArray.map((sub: any) => this.languageFlag=='English'? sub.examType:sub.m_ExamType))];
  //     const arrayBySubject=this.grapbhDetailsArray.filter((x:any)=> (this.languageFlag=='English'? x.subjectName: x.m_SubjectName)==this.subjectControl?.value);
  //     const SubSubjectArray= [...new Set(arrayBySubject.map((sub: any) => this.languageFlag=='English'? sub.optionName:sub.m_OptionName))];
  //     let ArryOfSeries:any=[];
  //     ExamType.map((x:any)=>{
  //       const obj={
  //         name: x,
  //         data: (arrayBySubject.filter((y:any)=>(this.languageFlag=='English'? y.examType:y.m_ExamType)==x)).map((z:any)=> z.actualGrade)
  //       }
  //       ArryOfSeries.push(obj)
  //     })
  //     this.getLineChart(ArryOfSeries,SubSubjectArray);
  // }
  // getLineChart(series:any, categories:any){
  //   this.lineChartOptions = {
  //     series: series,
  //     chart: {
  //     height: 350,
  //     type: 'area',
  //     toolbar: {
  //       show: false
  //     }
  //   },
  //   dataLabels: {
  //     enabled: false
  //   },
  //   stroke: {
  //     curve: 'smooth'
  //   },
  //   xaxis: {
  //     categories: categories
  //   },
  //   yaxis: {
  //     // tickAmount: 5,
  //     labels: {
  //       formatter: function(val:any) {
  //         return val.toFixed(0);
  //       }
  //     }
  //   }
  // };

  // }
}
