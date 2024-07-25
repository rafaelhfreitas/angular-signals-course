import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Course} from "../models/course.model";


@Injectable({
  providedIn: "root"
})
export class CoursesServiceWithFetch {

  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();
    //async syntaxw will wrapp all primitives returns into a promise automaticly
    return payload.courses;

  }


  async createCourse(course: Partial<Course>): Promise<Course> {

    const response = await fetch(`${this.env.apiRoot}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course)
    })

    return response.json();

  }


  async saveCourse(courseId: string, 
                   changes: Partial<Course>) : Promise<Course> {

      const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(changes)
      });


      return response.json();


  }


  async deleteCourse(courseId: string): Promise<void> {
    await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: "DELETE",
    });

  }


}
