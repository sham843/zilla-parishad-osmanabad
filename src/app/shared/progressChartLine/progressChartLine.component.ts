import { OnInit, Component,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorsService } from 'src/app/core/services/errors.service';
@Component({
  selector: 'progressChartLine',
  templateUrl: './progressChartLine.component.html',
  styleUrls: ['./progressChartLine.component.scss'],
  standalone: true,
  imports: [CommonModule, 
    NgApexchartsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule
    ],

})
export class progressChartLineComponent implements OnInit {
  lineChartOptions:any;
  subjectControl=new FormControl(' ');
  subjectArray=new Array();
  grapbhDetailsArray=new Array();
  dashboardObj:any;
  selectedStudentObj:any;
  languageFlag!:string;
  groupId!:number;
  constructor(private apiService:ApiService, private webStorage:WebStorageService,
    private ngxSpinner:NgxSpinnerService, private errors:ErrorsService) { }

  ngOnInit() {
    this.webStorage.langNameOnChange.subscribe(lang => {
      this.languageFlag = lang;
      this.getSubjectData();
    });
    this.dashboardObj=JSON.parse(localStorage.getItem('selectedBarchartObjData')||'')
    this.webStorage.selectedLineChartObj.subscribe((res:any)=>{
      this.selectedStudentObj=JSON.parse(res);
      this.groupId=this.selectedStudentObj.groupId==0? this.dashboardObj.groupId:this.selectedStudentObj.groupId;
      this.getLineChartDetails();
    })
    
    // this.webStorage.selectedBarchartObjData.subscribe((res:any)=>{
    //   this.dashboardObj=res;
    // })

  
   
  }
  getLineChartDetails(){
    
    let str=  this.groupId==1? 'GetDataFor1st2ndStdStudentChart':'GetDataFor3rdAboveStdStudentChart';
    this.apiService.setHttp('GET', 'zp-osmanabad/Dashboard/' + str+ '?GroupId='+ this.groupId+'&StudentId='+this.selectedStudentObj?.objData?.studentId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.responseData.responseData1.length) {
         this.grapbhDetailsArray=res.responseData.responseData1 ;
         this.getSubjectData();
        } else {
          this.grapbhDetailsArray=[];
          this.subjectArray=[];
        }
      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err.statusCode) })
    });
  }
  getSubjectData() {
    this.subjectArray = [];
    this.subjectArray = [...new Set(this.grapbhDetailsArray.map((sub: any) => this.languageFlag=='English'? sub.subjectName:sub.m_SubjectName))];
    this.subjectControl.patchValue(this.subjectArray[0]);
     this.constuctLineChart();
  }
  constuctLineChart(){
      const ExamType = [...new Set(this.grapbhDetailsArray.map((sub: any) => this.languageFlag=='English'? sub.examType:sub.m_ExamType))];
      const arrayBySubject=this.grapbhDetailsArray.filter((x:any)=> (this.languageFlag=='English'? x.subjectName: x.m_SubjectName)==this.subjectControl?.value);
      const higherGrade=arrayBySubject[0]?.maxGrade;
      const SubSubjectArray= [...new Set(arrayBySubject.map((sub: any) => this.groupId==1?(this.languageFlag=='English'? sub.optionName:sub.m_OptionName):(this.languageFlag=='English'? sub.question:sub.m_Question)))];
      let ArryOfSeries:any=[];
      ExamType.map((x:any)=>{
        const obj={
          name: x,
          data: (arrayBySubject.filter((y:any)=>(this.languageFlag=='English'? y.examType:y.m_ExamType)==x)).map((z:any)=> z.actualGrade)
        }
        ArryOfSeries.push(obj)
      })
      this.getLineChart(ArryOfSeries,SubSubjectArray,higherGrade);
  }
  getLineChart(series:any, categories:any, higherGrade:any){
    this.lineChartOptions = {
      series: series,
      chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      min: 0,
      max: higherGrade,
      labels: {
        formatter: function(val:any) {
          return val.toFixed(0);
        }
      }
    }
  };
  }

}
