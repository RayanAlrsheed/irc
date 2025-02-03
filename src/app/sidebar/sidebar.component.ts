import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ChatService } from '../chat.service';
import { IChannel } from '../models';
import { ChannelComponent } from '../channel/channel.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { tap } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [HeaderComponent, ChannelComponent, CommonModule, SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  chatService = inject(ChatService);

  channels = this.chatService.channels;

  constructor() {
    this.chatService.removedChannel$
      .pipe(
        tap(() => {
          this.channels = this.chatService.channels;
        })
      )
      .subscribe();
  }
}
