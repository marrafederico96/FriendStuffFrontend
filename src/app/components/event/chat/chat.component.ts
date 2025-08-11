import {
  AfterViewChecked,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageDto } from '../../../dto/eventDto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chat',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class Chat implements OnInit, AfterViewChecked {
  public authService = inject(AuthService);
  private eventService = inject(EventService);
  private fb = inject(FormBuilder);

  public messageForm!: FormGroup;
  public error?: string;
  public loading = signal<boolean>(false);

  private route = inject(ActivatedRoute);

  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLElement>;

  eventName = signal<string>('');

  messages = computed(() => {
    const name = this.eventName();
    return (
      this.authService.userEvents().find((e) => e.normalizedEventName === name)
        ?.messages ?? []
    );
  });

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTo({
        top: this.chatContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    const name = urlSegments[urlSegments.length - 1].path;
    this.eventName.set(name);
    this.generateForm();
  }

  generateForm() {
    this.messageForm = this.fb.group({
      messageContent: [''],
    });
  }

  onSubmit() {
    if (this.messageForm.valid) {
      this.loading.set(true);
      const messageData = this.messageForm.value;
      const sender = this.authService.userInfo()?.userName;

      const message: MessageDto = {
        normalizedEventName: this.eventName(),
        messageContent: messageData.messageContent,
        senderUsername: sender,
      };

      console.log(message);
      this.eventService.sendMessage(message).subscribe({
        next: () => {
          this.authService.loadUserInfo();
          this.loading.set(false);
          this.messageForm.reset();
        },
        error: (err) => {
          this.loading.set(false);
          this.error = err.error.message;
        },
      });
    }
  }
}
