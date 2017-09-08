import { Component, OnDestroy, OnInit } from '@angular/core';
import { Conference } from '../../conference/types';
import { DEFAULT_ITEMS_PER_PAGE, START_PAGE } from '../../table.config';
import { Subscription } from 'rxjs/Subscription';
import { unsubscribeAll } from '../../utils';
import 'rxjs/add/observable/empty';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { deleteConference, getAllConferences, GetAllConferencesResponse } from '../management.apollo-query';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/fromPromise';

@Component({
  selector: 'cp-conference-table-list',
  templateUrl: './conference-table-list.component.html',
  styles: []
})
export class ConferenceTableListComponent implements OnInit, OnDestroy {

  conferences: [Conference];
  amountPerPage = DEFAULT_ITEMS_PER_PAGE;
  total = 0;
  pageNumber = START_PAGE;
  subscriptions: Subscription[] = [];

  allConferenceQuery: ApolloQueryObservable<any>;

  constructor(private apollo: Apollo) {
    this.deleteConference = this.deleteConference.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
  }

  ngOnInit() {
    this.getAllConferences();
  }

  navigateToPage(pageNumber) {
    this.refreshConferences(pageNumber);
  }

  getAllConferencesQueryVariables(pageNumber = START_PAGE) {
    const lastId = this.conferences && pageNumber > 1 ? this.conferences[this.conferences.length - 1].id : null;
    return {
      first: DEFAULT_ITEMS_PER_PAGE,
      after: lastId
    };
  }

  private updateData(data, pageNumber) {
    this.conferences = data.conferences;
    this.total = data._allConferencesMeta.count;
    this.pageNumber = pageNumber;
  }

  private getAllConferences(pageNumber = START_PAGE) {

    this.allConferenceQuery = this.apollo.watchQuery<GetAllConferencesResponse>({
      query: getAllConferences,
      variables: this.getAllConferencesQueryVariables(pageNumber)
    });

    const getAllConferences$ = this.allConferenceQuery
      .take(1)
      .subscribe(({data}) => this.updateData(data, pageNumber));
    this.subscriptions = this.subscriptions.concat(getAllConferences$);
  }

  private refreshConferences(pageNumber = START_PAGE) {
    return this.allConferenceQuery.refetch(this.getAllConferencesQueryVariables(pageNumber))
      .then(({data}) => {
        this.updateData(data, pageNumber);
        return data;
      });
  }

  deleteConference(id) {
    const deleteConference$ = this.apollo.mutate({
      mutation: deleteConference,
      variables: {
        id: id
      }
    }).switchMap(_ => this.refreshConferences(START_PAGE))
      .take(1)
      .subscribe();

    this.subscriptions = this.subscriptions.concat(deleteConference$);
  }

  ngOnDestroy() {
    unsubscribeAll(this.subscriptions);
  }

}
