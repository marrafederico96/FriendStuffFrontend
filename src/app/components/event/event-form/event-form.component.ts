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
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-event-form',
    imports: [ReactiveFormsModule, MatDatepickerModule, MatProgressSpinnerModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
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
            startDate: [new Date(), Validators.required],
            endDate: [new Date(), Validators.required],
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.eventForm.valid) {
            this.loading.set(true);
            const email = this.authService.userInfo()!.email;
            const formValue = this.eventForm.value;
            const formattedStartDate = this.formatDate(formValue.startDate as Date);
            const formattedEndDate = this.formatDate(formValue.endDate as Date);

            if (email !== undefined) {
                const eventData: EventDto = {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    adminEmail: email,
                    eventName: formValue.eventName,
                };

                this.eventService.createEvent(eventData).subscribe({
                    next: () => {
                        this.authService.loadUserInfo();
                        this.dialogRef.close(this.eventForm.value);
                        this.loading.set(false);
                    },
                    error: (err) => {
                        this.error = err.error.message;
                        this.loading.set(false);
                    }
                })
            }
        }
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
