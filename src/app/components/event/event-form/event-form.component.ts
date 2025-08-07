import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { EventDto } from '../../../dto/eventDto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-event-form',
    imports: [ReactiveFormsModule, MatProgressSpinnerModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './event-form.component.html',
    styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private eventService = inject(EventService);
    private authService = inject(AuthService);

    public eventForm!: FormGroup;
    public loading = signal<boolean>(false);
    readonly dialogRef = inject(MatDialogRef<EventFormComponent>);

    public error?: string;

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm() {
        this.eventForm = this.fb.group({
            eventName: ['', Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.loading.set(true);
        if (this.eventForm.valid) {
            const newEvent: EventDto = this.eventForm.value;
            const email = this.authService.userInfo()?.email;
            if (email !== undefined) {
                newEvent.adminEmail = email;
            }
            this.eventService.createEvent(this.eventForm.value).subscribe({
                next: () => {
                    this.authService.loadUserInfo();
                    this.dialogRef.close(this.eventForm.value);
                    this.loading.set(false);
                },
                error: () => {
                    this.error = "Error. Please try again.";
                    this.loading.set(false);
                }
            })
        }
    }

}
