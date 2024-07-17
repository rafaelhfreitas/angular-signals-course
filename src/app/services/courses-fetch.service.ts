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


}
