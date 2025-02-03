import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ChatService, AuthService],
})
export class SharedModule {}
