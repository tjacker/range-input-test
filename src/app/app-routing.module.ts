import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioSliderComponent } from './scenario-slider/scenario-slider';

const routes: Routes = [{ path: 'slider', component: ScenarioSliderComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
