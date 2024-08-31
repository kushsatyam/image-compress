import { Routes } from '@angular/router';
import { CompressImageComponent } from './compress-image/compress-image.component';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './features/features.component';

export const routes: Routes = [
    {path:'home', redirectTo:'', pathMatch:'full'},
    {path:'', component:HomeComponent},
    {path:'compress-multiple-image', component:CompressImageComponent},
    {path:'features', component:FeaturesComponent}
];
