import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioSliderComponent } from './scenario-slider/scenario-slider';
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  { path: 'slider', component: ScenarioSliderComponent },
  { path: 'test', component: TestPageComponent },
  { path: '', redirectTo: 'slider', pathMatch: 'full' },
  { path: '**', redirectTo: 'slider' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
