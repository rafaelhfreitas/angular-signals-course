import {afterNextRender, Component, computed, effect, EffectRef, ElementRef, inject, Injector, OnInit, signal, viewChild} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, interval, startWith, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTooltip,
    CoursesCardListComponent,
    LoadingIndicatorComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {

    #courses = signal<Course[]>([]);
    dialog = inject(MatDialog);
    coursesService = inject(CoursesService);
    messagesService = inject(MessagesService);

    beginnerList = viewChild("beginnerList", {read: MatTooltip});
    // another way 
    //beginnerList = viewChild<CoursesCardListComponent>("beginnerList");

    //courses$ = toObservable(this.#courses);


    beginnerCourses = computed(() => {
      const courses = this.#courses();
      return courses.filter(course => course.category === 'BEGINNER')
    })


    advancedCourses = computed(() => {
      const courses = this.#courses();
      return courses.filter(course => course.category === 'ADVANCED')
    })

    constructor() {

      // this.courses$.subscribe(
      //   courses => console.log(`courses$: `, courses)
      // );

      effect(() => {
        //console.log(`beginnerList comp:`, this.beginnerList());
      })

      effect(() => {
        // console.log(`Beginner courses`, this.beginnerCourses());
        // console.log(`Advanced courses`, this.advancedCourses());

      })

      this.loadCourses().then(() => console.log(`All courses are loaded: `, this.#courses()));
  
    }

    
    async loadCourses() {
      try{
        const courses = await this.coursesService.loadAllCourses();
        this.#courses.set(courses.sort(sortCoursesBySeqNo));
      } 
      catch(error) {
        this.messagesService.showMessage(`Error loading courses!`, "error")
        console.error(error);

      }
    }


    onCourseUpdated(updatedCourse: Course) {

      const courses = this.#courses();

      const newCourses = courses.map(course => course.id === updatedCourse.id ?  updatedCourse : course);

      this.#courses.set(newCourses);

    }


    async onCourseDeleted(courseId: string){
      try {
        await this.coursesService.deleteCourse(courseId);
        const courses = this.#courses();
        const newCourses = courses.filter(course => course.id !== courseId)
        this.#courses.set(newCourses);


      } catch (error) {
        this.messagesService.showMessage(`Error deleting courses!`, "error")
        console.error(error);
      }
    }


    async onAddCourse() {
      const newCourse = await openEditCourseDialog(
        this.dialog,
        {
          mode: "create", 
          title: "Create a new course"
        }
      )

      if(!newCourse) {
        return;
      }

      const newCourses = [
        ...this.#courses(),
        newCourse
      ];

      this.#courses.set(newCourses);
    }


    injector = inject(Injector);
    courses$ = from(this.coursesService.loadAllCourses());
    
    onToSignalExample() {

      // const courses = toSignal(this.courses$, {injector: this.injector});
      
      // effect(() => {
      //   console.log(`courses: `, courses());
      // }, {
      //   injector: this.injector
      // })

      // const number$ = interval(1000);
      // const numbers = toSignal(number$, {
      //   injector: this.injector,
      //   initialValue: 0
      // });

      const number$ = interval(1000).pipe(startWith(0));
      const numbers = toSignal(number$, {
        injector: this.injector,
        requireSync: true
      });

      effect(() => {
        console.log(`numbers: `, numbers())
      }, {
        injector: this.injector
      })
    }


    onToObservableExample() {
      // const courses$ = toObservable(this.#courses, {injector: this.injector});
      // courses$.subscribe(courses =>  console.log(`courses$: `, courses))

      const numbers = signal(0);

      numbers.set(1);
      numbers.set(2);
      numbers.set(3);

      const numbers$ = toObservable(numbers, { injector: this.injector});

      numbers.set(4);

      numbers$.subscribe(val => console.log(`numbers$: `, val));

      numbers.set(5);
    }




}
