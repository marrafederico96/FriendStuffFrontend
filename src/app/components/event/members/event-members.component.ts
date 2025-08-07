import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatListModule } from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { EventService } from '../../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { EventDto } from '../../../dto/eventDto';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AddMemberDto, SearchUserDto } from '../../../dto/userInfoDto';
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: 'app-event-members',
    imports: [MatListModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatChipsModule, MatIconModule, MatCardModule],
    templateUrl: './event-members.component.html',
    styleUrl: './event-members.component.scss'
})
export class EventFormComponent implements OnInit {
    public eventService = inject(EventService);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    public event: EventDto | undefined;
    public username?: string;
    public error?: string;

    eventName = signal('');
    eventUser = computed(() => {
        const events = this.authService.userEvents();
        return events.find(e => e.normalizedEventName === this.eventName());
    });

    searchForm = new FormGroup({
        searchUser: new FormControl('')
    })

    ngOnInit(): void {
        const urlSegments = this.route.snapshot.url;
        const name = urlSegments[urlSegments.length - 1].path;
        this.eventName.set(name);
    }


    isUsernameParticipant(): boolean {
        return !!this.eventUser()?.participants?.find(
            p => p.userName?.toLowerCase() === this.username?.toLowerCase()
        );
    }


    addMember() {
        if (this.username != undefined) {
            const username = this.username.trim().toLowerCase();
            const adminUsername = this.authService.userInfo()?.userName?.trim().toLowerCase();
            const userToAdd: AddMemberDto = {
                adminUsername: adminUsername!,
                normalizedEventName: this.eventUser()?.normalizedEventName!,
                username: username
            };

            this.eventService.addMember(userToAdd).subscribe({
                next: () => {
                    this.username = undefined;
                    this.authService.loadUserInfo();
                },
                error: (err) => {
                    this.error = err.message;
                }
            });
        }
    }

    removeMember(username: string) {
        username.trim().toLowerCase();
        const adminUsername = this.authService.userInfo()?.userName?.trim().toLowerCase();
        const userToRemove: AddMemberDto = {
            adminUsername: adminUsername!,
            normalizedEventName: this.eventUser()?.normalizedEventName!,
            username: username
        };

        this.eventService.removeMember(userToRemove).subscribe({
            next: () => {
                this.authService.loadUserInfo();
            },
            error: (err) => {
                this.error = err.message;
            }
        });
    }

    onSubmit() {
        const formValue = this.searchForm.value;
        const username: SearchUserDto = { username: formValue.searchUser ?? '' };
        this.eventService.searchUser(username).subscribe({
            next: (response) => {
                this.username = response.username;
                this.error = "";
                this.searchForm.reset();
            },
            error: () => {
                this.error = "User not found";
            }
        });
    }
}