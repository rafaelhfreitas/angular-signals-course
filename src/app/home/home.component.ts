import {afterNextRender, Component, computed, effect, EffectRef, ElementRef, inject, Injector, OnInit, signal, viewChild} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
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

    beginnerCourses = computed(() => {
      const courses = this.#courses();
      return courses.filter(course => course.category === 'BEGINNER')
    })


    advancedCourses = computed(() => {
      const courses = this.#courses();
      return courses.filter(course => course.category === 'ADVANCED')
    })

    constructor() {


      effect(() => {
        console.log(`beginnerList comp:`, this.beginnerList());
      })

      effect(() => {
        console.log(`Beginner courses`, this.beginnerCourses());
        console.log(`Advanced courses`, this.advancedCourses());

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






}
