import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TodoComponent } from './app/To-do list/todo.component';
import { DiaryComponent } from './app/Diary/diary.component';
import { ConsultationComponent } from './app/Consultation/consultation.component';

const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' as const },
  { path: 'todo', component: TodoComponent },
  { path: 'diary', component: DiaryComponent },
  { path: 'consultation', component: ConsultationComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
