import { DescriptionGameComponent } from './components/course/course-game/description-game/description-game.component';
import { TranslationGameComponent } from './components/course/course-game/translation-game/translation-game.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { RouterModule } from '@angular/router';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoursesComponent } from './components/course/courses/courses.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NavComponent } from './nav/nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewCourseComponent } from './components/course/new-course/new-course.component';
import { TokenInterceptor } from './token-interceptor';
import { MatTableModule } from '@angular/material/table';
import { RegisterComponent } from './auth/register/register.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { RemoveWordSetDialogComponent } from './shared/remove-word-set-dialog/remove-word-set-dialog.component';
import { ChooseGameTypeComponent } from './components/course/course-game/choose-game-type/choose-game-type.component';
import { CourseDisplayComponent } from './components/course/course-display/course-display.component';
import { ScatterGameComponent } from './components/course/course-game/scatter-game/scatter-game.component';
import { MatMenuModule } from '@angular/material/menu';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ChangePasswordComponent } from './components/user-settings/change-password/change-password.component';
import { ChangeNicknameComponent } from './components/user-settings/change-nickname/change-nickname.component';
import { ActivityComponent } from './components/user-settings/activity/activity.component';
import { ChangeEmailComponent } from './components/user-settings/change-email/change-email.component';
import { CoursesSharedComponent } from './components/course/courses-shared/courses-shared.component';
import { ShareWordSetDialogComponent } from './shared/share-word-set-dialog/share-word-set-dialog.component';
import { CourseCommentsComponent } from './components/course/course-comments/course-comments.component';
import { ContestPlayerDialogComponent } from './shared/contest-player-dialog/contest-player-dialog.component';
import { AcceptDuelDialogComponent } from './shared/accept-duel-dialog/accept-duel-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { StatisticComponent } from './components/user-settings/statistic/statistic.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatRadioModule } from '@angular/material/radio';
import { ChartsComponent } from './components/user-settings/charts/charts.component';
import { ChunkPipe } from './components/user-settings/activity/chunk.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PvpGameComponent } from './components/course/course-game/pvp-game/pvp-game.component';
import { DatePipe } from '@angular/common';
import { MatTableResponsiveDirective } from './components/course/edit-course/responsive-table.directive';

const materials = [
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatGridListModule,
  FlexLayoutModule,
  MatCardModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatMenuModule,
  MatRadioModule,
  MatPaginatorModule
];

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    WelcomeComponent,
    LoginComponent,
    NavComponent,
    NewCourseComponent,
    RegisterComponent,
    RemoveWordSetDialogComponent,
    EditCourseComponent,
    ChooseGameTypeComponent,
    CourseDisplayComponent,
    TranslationGameComponent,
    DescriptionGameComponent,
    ScatterGameComponent,
    UserSettingsComponent,
    ChangePasswordComponent,
    ChangeNicknameComponent,
    ActivityComponent,
    ChangeEmailComponent,
    CoursesSharedComponent,
    ShareWordSetDialogComponent,
    CourseCommentsComponent,
    ContestPlayerDialogComponent,
    AcceptDuelDialogComponent,
    StatisticComponent,
    ChartsComponent,
    ChunkPipe,
    PvpGameComponent,
    MatTableResponsiveDirective
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxChartsModule,
    materials
  ],
  entryComponents: [RemoveWordSetDialogComponent],
  providers: [DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
