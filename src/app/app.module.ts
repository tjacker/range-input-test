import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScenarioSliderComponent } from './scenario-slider/scenario-slider';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, ScenarioSliderComponent],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
