import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { EventService } from '../../../services/event.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExpenseEventDto } from '../../../dto/expenseEventDto';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-expense',
  imports: [
    MatFormFieldModule,
    MatDividerModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
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
    const selectedEvent = userEvents?.find(
      (event) => event.normalizedEventName === eventName
    );
    return selectedEvent?.expensesEvent || [];
  });

  public expenseParticipants = computed(() => {
    const userEvents = this.authService.userInfo()?.events;
    const eventName = this.eventName();
    const currentUser = this.authService.userInfo()?.userName;
    const selectedEvent = userEvents?.find(
      (event) => event.normalizedEventName === eventName
    );
    return (selectedEvent?.participants || []).filter(
      (p) => p.userName !== currentUser
    );
  });

  public indexedParticipants = computed(() =>
    this.expenseParticipants().map((participant, index) => ({
      participant,
      index,
    }))
  );

  constructor() {
    effect(() => {
      this.generateForm();
    });
  }

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    const name = urlSegments[urlSegments.length - 1].path;
    this.eventName.set(name);
  }

  get participantsFormArray() {
    return this.expenseForm.get('participants') as FormArray;
  }

  generateForm() {
    this.expenseForm = this.fb.group({
      expenseName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      participants: this.fb.array(
        this.expenseParticipants().map(() => new FormControl(false))
      ),
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const formData: ExpenseEventDto = this.expenseForm.value;
      this.loading.set(true);
      const selectedParticipants = this.expenseForm.value.participants
        .map((checked: boolean, i: number) =>
          checked ? { userName: this.expenseParticipants()[i].userName } : null
        )
        .filter((v: any) => v !== null);

      const currentUserName = this.authService.userInfo()?.userName;
      if (currentUserName) {
        selectedParticipants.push({ userName: currentUserName });
      }

      const newExpense: ExpenseEventDto = formData;
      const payerEmail = this.authService.userInfo()?.email;

      if (payerEmail != null) {
        newExpense.payerUsername = payerEmail;
      }

      newExpense.expenseParticipant = selectedParticipants;
      newExpense.eventName = this.eventName();

      this.eventService.addExpense(newExpense).subscribe({
        next: () => {
          this.loading.set(false);
          this.error = undefined;
          this.expenseForm.reset();
          this.authService.loadUserInfo();
        },
        error: (err) => {
          this.loading.set(false);
          this.error = err.error.message;
        },
      });
    }
  }
}
