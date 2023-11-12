import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AnaliseGramaticalComponent } from './pages/analise-gramatical/analise-gramatical.component';
import { AnaliseLexicaComponent } from './pages/analise-lexica/analise-lexica.component';
import { AnaliseSemanticaComponent } from './pages/analise-semantica/analise-semantica.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'lexico', component: AnaliseLexicaComponent },
  { path: 'calculadora', component: HomeComponent },
  { path: 'sobre', component: AboutComponent },
  { path: 'sintatico', component: AnaliseGramaticalComponent },
  { path: 'semantico', component: AnaliseSemanticaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
