import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AuthService } from './services/auth.service';
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FriendStuff');
  public authService = inject(AuthService);

  constructor() {
    this.authService.loadUserInfo();
  }

}
