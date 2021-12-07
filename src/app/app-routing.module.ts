import { PvpGameComponent } from './components/course/course-game/pvp-game/pvp-game.component';
import { ChartsComponent } from './components/user-settings/charts/charts.component';
import { StatisticComponent } from './components/user-settings/statistic/statistic.component';
import { CourseCommentsComponent } from './components/course/course-comments/course-comments.component';
import { ChangeEmailComponent } from './components/user-settings/change-email/change-email.component';
import { ActivityComponent } from './components/user-settings/activity/activity.component';
import { ChangeNicknameComponent } from './components/user-settings/change-nickname/change-nickname.component';
import { ChangePasswordComponent } from './components/user-settings/change-password/change-password.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { DescriptionGameComponent } from './components/course/course-game/description-game/description-game.component';
import { TranslationGameComponent } from './components/course/course-game/translation-game/translation-game.component';
import { ScatterGameComponent } from './components/course/course-game/scatter-game/scatter-game.component';
import { CourseDisplayComponent } from './components/course/course-display/course-display.component';
import { ChooseGameTypeComponent } from './components/course/course-game/choose-game-type/choose-game-type.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { NewCourseComponent } from './components/course/new-course/new-course.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CoursesComponent } from './components/course/courses/courses.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CoursesSharedComponent } from './components/course/courses-shared/courses-shared.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'pvp', canActivate: [AuthGuard], component: PvpGameComponent },
  { path: 'edit-course/:id', canActivate: [AuthGuard], component: EditCourseComponent },
  { path: 'course-display/:id', canActivate: [AuthGuard], component: CourseDisplayComponent },
  { path: 'choose-game-type/:id', canActivate: [AuthGuard], component: ChooseGameTypeComponent },
  { path: 'scatter-game/:id', canActivate: [AuthGuard], component: ScatterGameComponent },
  { path: 'translate-game/:id', canActivate: [AuthGuard], component: TranslationGameComponent },
  { path: 'description-game/:id', canActivate: [AuthGuard], component: DescriptionGameComponent },
  { path: 'comments/:id', canActivate: [AuthGuard], component: CourseCommentsComponent },
  {
    path: 'user-settings', canActivate: [AuthGuard], component: UserSettingsComponent, children: [
      {
        path: 'changePassword', component: ChangePasswordComponent
      },
      {
        path: 'changeNickname', component: ChangeNicknameComponent
      },
      {
        path: 'activity', component: ActivityComponent
      },
      {
        path: 'changeEmail', component: ChangeEmailComponent
      },
      {
        path: 'statistic', component: StatisticComponent
      },
      {
        path: 'charts/:id/:type', component: ChartsComponent
      }
    ]
  },
  { path: 'new-course', canActivate: [AuthGuard], component: NewCourseComponent },
  { path: 'courses', canActivate: [AuthGuard], component: CoursesComponent },
  { path: 'shared-courses', canActivate: [AuthGuard], component: CoursesSharedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: WelcomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
