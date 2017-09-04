import { Component, OnDestroy, OnInit } from '@angular/core';
import { Conference } from '../types';
import { chunk, unsubscribeAll } from '../../utils';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/empty';
import { Apollo } from 'apollo-angular';
import { AllConferencesQuery, AllConferencesQueryResponse } from '../conference.apollo-query';

@Component({
  selector: 'cp-conference-card-list',
  templateUrl: './conference-card-list.component.html',
  styles: []
})
export class ConferenceCardListComponent implements OnInit, OnDestroy {

  loading: boolean;
  allConferences: Conference[];
  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    const allConferences$ = this.apollo.watchQuery<AllConferencesQueryResponse>({
      query: AllConferencesQuery
    }).subscribe(({data}) => {
      this.loading = data.loading;
      this.allConferences = data.allConferences;
    });

    this.subscriptions = this.subscriptions.concat(allConferences$);
  }

  chunkConferences(conferences: Conference[] = []): Conference[][] {
    return chunk(conferences, 3);
  }

  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
