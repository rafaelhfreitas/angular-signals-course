import {afterNextRender, Component, computed, effect, EffectRef, inject, Injector, OnInit, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';


type Counter = {
  value: number
}

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {


    courses = signal<Course[]>([]);

    coursesService = inject(CoursesServiceWithFetch);


    constructor() {

      // you can use ngOnInit to start load or constructor or afterNextRender
      //this.loadCourses().then(() => console.log(`All courses are loaded: `, this.courses()));

      afterNextRender(() => {
        this.loadCourses().then(() => console.log(`All courses are loaded: `, this.courses()));
      }) 
  
    }
    
    
    ngOnInit(): void {
      // you can use ngOnInit to start load or constructor or afterNextRender
      //this.loadCourses().then(() => console.log(`All courses are loaded: `, this.courses()));
    }


    async loadCourses() {
      try{
        const courses = await this.coursesService.loadAllCourses();
        this.courses.set(courses);
      } 
      catch(error) {
        alert(`Error loading courses!`);
        console.error(error);

      }
    }




}
