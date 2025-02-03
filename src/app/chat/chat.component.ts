import {
  AfterViewChecked,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { IChannel, IMessage } from '../models';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat.service';
import { combineLatest, elementAt, tap } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [MessageComponent, CommonModule, SharedModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService);
  channelName?: string;
  messages: IMessage[] = [];
  writtenMessage: string = '';
  chatElement?: HTMLElement;
  initialChatSize?: number;
  scrollDown = false;

  newMessage$ = this.chatService.newMessage$.asObservable();
  chosenChannel$ = this.chatService.chosenChannel$.asObservable();
  removedChannel$ = this.chatService.removedChannel$.asObservable();
  constructor() {}
  ngAfterViewChecked(): void {
    if (this.scrollDown) {
      this.chatElement?.scrollTo({
        top: this.chatElement.scrollHeight,
        behavior: 'instant',
      });
      this.scrollDown = false;
    }
  }
  ngOnInit(): void {
    this.chatElement = document.getElementById('chat')!;
    this.initialChatSize = this.chatElement.scrollHeight;
    this.chosenChannel$
      .pipe(
        tap((channel) => {
          if (channel && channel.name !== this.channelName) {
            this.channelName = channel.name;
            this.messages = [...channel.messages];
          }
        })
      )
      .subscribe();

    this.removedChannel$
      .pipe(
        tap((channel) => {
          if (this.channelName === channel.name) {
            this.channelName = undefined;
            this.messages = [];
            this.writtenMessage = '';
          }
        })
      )
      .subscribe();

    this.newMessage$
      .pipe(
        tap((message) => {
          if (message.channel === this.channelName) {
            this.messages.push(message);
            this.scrollDown =
              this.chatElement!.scrollHeight - this.chatElement!.scrollTop <
              1000;
          }
        })
      )
      .subscribe();
  }

  sendMessage() {
    if (this.writtenMessage && this.channelName) {
      this.chatService.sendMessage(this.writtenMessage, this.channelName);
    }
    this.writtenMessage = '';
  }
}
