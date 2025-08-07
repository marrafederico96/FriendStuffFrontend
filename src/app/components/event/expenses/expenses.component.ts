import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ExpenseDto } from '../../../dto/expenseDto';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-expense',
    imports: [MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatIconModule],
    templateUrl: './expenses.component.html',
    styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit {
    private eventService = inject(EventService);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);

    eventName = signal('');

    private fb = inject(FormBuilder);
    public expenseForm!: FormGroup;
    public error?: string;

    public loading = signal<boolean>(false);
    public expenses = computed(() => {
        const userEvents = this.authService.userInfo()?.events;
        const eventName = this.eventName();
        const selectedEvent = userEvents?.find((event) => event.normalizedEventName === eventName);
        return selectedEvent?.expensesEvent || [];
    });


    ngOnInit(): void {
        const urlSegments = this.route.snapshot.url;
        const name = urlSegments[urlSegments.length - 1].path;
        this.eventName.set(name);
        this.generateForm();
    }

    generateForm() {
        this.expenseForm = this.fb.group({
            expenseName: [''],
            amount: [0, Validators.min(0.01)]
        });
    }

    onSubmit() {
        this.loading.set(true);
        const formData = this.expenseForm.value;

        const newExpense: ExpenseDto = formData;
        const payerEmail = this.authService.userInfo()?.email;

        if (payerEmail != null) {
            newExpense.payerUsername = payerEmail
        }

        newExpense.eventName = this.eventName();
        this.eventService.addExpense(newExpense).subscribe({
            next: () => {
                this.loading.set(false);
                this.expenseForm.reset();
                this.error = undefined;
                this.authService.loadUserInfo();
            },
            error: () => {
                this.loading.set(false);
                this.error = "Error. Retry."
            }
        });
    }


}