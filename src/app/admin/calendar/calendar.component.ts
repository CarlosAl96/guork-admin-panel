import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { ContractsService } from '../../core/services/contracts.service';
import { Contract } from '../../core/models/contract';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CardModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  public contracts: Contract[] = [];
  public user!: User | undefined;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    droppable: true,
    expandRows: true,
    locale: esLocale,
    plugins: [dayGridPlugin, interactionPlugin, timeGridWeek],
    datesSet: (arg) => this.handleDatesSet(arg),
    headerToolbar: {
      end: 'prevYear,prev,next,nextYear',
    },
  };

  constructor(
    private readonly contractsService: ContractsService,
    private readonly sessionService: SessionService
  ) {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
  }

  public handleDatesSet(arg: DatesSetArg): void {
    const startDate = arg.start;
    const endDate = arg.end;

    this.contractsService
      .getContractsBetweenDates(
        startDate.toISOString(),
        endDate.toISOString(),
        this.user?.code_dealer ?? 0
      )
      .subscribe((resp) => {
        if (resp) {
          this.contracts = resp.response;

          let events: any[] = [];

          this.contracts.map((contract) => {
            events.push({
              title: contract.user_email,
              date: contract.prox_page_date,
            });
          });

          this.calendarOptions.events = events;
        }
      });
  }
}
