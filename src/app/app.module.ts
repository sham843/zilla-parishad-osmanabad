import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule ,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, CurrencyPipe, TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
