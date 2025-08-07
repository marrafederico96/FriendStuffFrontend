import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { EventDto } from '../../dto/eventDto';
import { EventService } from '../../services/event.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from "@angular/material/chips";
import { EventFormComponent } from "./members/event-members.component";
import { ExpensesComponent } from "./expenses/expenses.component";
@Component({
  selector: 'app-event',
  imports: [MatTabsModule, MatListModule, MatCardModule, MatChipsModule, EventFormComponent, ExpensesComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
  public authService = inject(AuthService);
  public eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  public event: EventDto | undefined;

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    const eventName = urlSegments[urlSegments.length - 1].path;
    this.event = this.authService.userEvents().find(e => e.normalizedEventName === eventName)
  }
}
