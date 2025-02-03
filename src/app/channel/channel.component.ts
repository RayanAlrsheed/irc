import { Component, inject, Input, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { IChannel } from '../models';
import { SharedModule } from '../shared/shared.module';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel',
  imports: [SharedModule, CommonModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css',
})
export class ChannelComponent implements OnInit {
  @Input() channel!: IChannel;
  chosen: boolean = false;

  chatService = inject(ChatService);
  removedChannel$ = this.chatService.removedChannel$;

  ngOnInit(): void {
    this.chatService.chosenChannel$
      .pipe(
        tap((chosen) => {
          if (chosen?.name === this.channel.name) {
            if (!this.chosen) {
              this.chosen = true;
            }
          } else {
            if (this.chosen) {
              this.chosen = false;
            }
          }
        })
      )
      .subscribe();
  }

  chooseChannel() {
    this.chatService.chosenChannel$.next(this.channel);
  }

  removeChannel() {
    this.removedChannel$.next(this.channel);
  }
}
