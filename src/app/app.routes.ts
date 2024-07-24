import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {LessonsComponent} from "./lessons/lessons.component";
import { isUserAuthenticate } from './guards/auth.guard';
import { CourseComponent } from './course/course.component';
import { courseResolver } from './course/course.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticate]
  },
  {
    'path': 'courses/:courseId',
    component: CourseComponent,
    canActivate: [isUserAuthenticate],
    resolve: {
      course: courseResolver
    }
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "lessons",
    component: LessonsComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
