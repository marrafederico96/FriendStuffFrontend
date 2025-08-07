import { Component, effect, inject, model, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventDto } from '../../dto/eventDto';
import {
  MatDialog,
} from '@angular/material/dialog';
import { EventFormComponent } from '../event/event-form/event-form.component';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public authService = inject(AuthService);
  public eventService = inject(EventService);
  private readonly dialog = inject(MatDialog);
  readonly name = model('');

  constructor() {
    effect(() => {
      this.authService.userEvents();
    });
  }

  openDialog(): void {
    this.dialog.open(EventFormComponent, {
      autoFocus: true,
      disableClose: true,
    });
  }


}
