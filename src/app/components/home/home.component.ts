import { Component, computed, effect, inject, model, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
} from '@angular/material/dialog';
import { EventFormComponent } from '../event/event-form/event-form.component';
import { EventService } from '../../services/event.service';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ExpenseRefundDto } from '../../dto/expenseEventDto';
import { BalanceDto, ResponseBalanceDto } from '../../dto/balanceDto';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, ReactiveFormsModule, MatIconModule, MatChipsModule, MatButtonModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public authService = inject(AuthService);
  public eventService = inject(EventService);
  private readonly dialog = inject(MatDialog);

  public fb = inject(FormBuilder);
  public refundForm!: FormGroup;

  readonly name = model('');

  public loading = signal<boolean>(false);
  public balances = signal<ResponseBalanceDto[]>([]);
  public updateBalances = computed(() => this.balances());

  public error?: string;

  constructor() {
    effect(() => {
      this.getBalances();
      this.authService.userEvents();
      this.updateBalances;
    });
  }

  ngOnInit(): void {
    this.generateForm();

  }

  public abs(value: number): number {
    return Math.abs(value);
  }

  generateForm() {
    this.refundForm = this.fb.group({
      amountRefund: ['', [Validators.required, Validators.min(0.01)]],
      payerUsername: ['', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.refundForm.valid) {
      this.loading.set(true);
      const refundData = this.refundForm.value;

      const newRefund: ExpenseRefundDto = {
        amountRefund: refundData.amountRefund,
        debtorUsername: this.authService.userInfo()?.userName ?? '',
        payerUsername: refundData.payerUsername
      };

    }
  }
  getBalances() {
    const balanceData: BalanceDto = {
      loggedUsername: this.authService.userInfo()?.userName ?? '',
    };

    this.eventService.getBalances(balanceData).subscribe({
      next: (response: ResponseBalanceDto[]) => {
        this.balances.set(response);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Error fetching balances';
      }
    });
  }

  openDialog(): void {
    this.dialog.open(EventFormComponent, {
      autoFocus: true,
      disableClose: true,
    });
  }


}
