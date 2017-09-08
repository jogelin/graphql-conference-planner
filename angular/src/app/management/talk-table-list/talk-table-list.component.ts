import { Component, OnDestroy, OnInit } from '@angular/core';
import { DEFAULT_ITEMS_PER_PAGE, START_PAGE } from '../../table.config';
import { Talk } from '../../talk/types';
import { Subscription } from 'rxjs/Subscription';
import { unsubscribeAll } from '../../utils';
import 'rxjs/add/observable/empty';
import { Apollo, ApolloQueryObservable } from 'apollo-angular/build/src';
import { deleteTalk, getAllTalks, GetAllTalksResponse } from '../management.apollo-query';

@Component({
  selector: 'cp-talk-table-list',
  templateUrl: './talk-table-list.component.html',
  styles: []
})
export class TalkTableListComponent implements OnInit, OnDestroy {

  talks: [Talk];
  amountPerPage = DEFAULT_ITEMS_PER_PAGE;
  total = 0;
  pageNumber = START_PAGE;
  private subscriptions: Subscription[] = [];

  allTalkQuery: ApolloQueryObservable<any>;

  constructor(private apollo: Apollo) {
    this.deleteTalk = this.deleteTalk.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
  }

  ngOnInit() {
    this.getAllTalks();
  }

  navigateToPage(pageNumber) {
    this.refreshTalks(pageNumber);
  }

  getAllTalksQueryVariables(pageNumber = START_PAGE) {
    const lastId = this.talks && pageNumber > 1 ? this.talks[this.talks.length - 1].id : null;
    return {
      first: DEFAULT_ITEMS_PER_PAGE,
      after: lastId
    };
  }

  private updateData(data, pageNumber) {
    this.talks = data.talks;
    this.total = data._allTalksMeta.count;
    this.pageNumber = pageNumber;
  }

  private getAllTalks(pageNumber = START_PAGE) {

    this.allTalkQuery = this.apollo.watchQuery<GetAllTalksResponse>({
      query: getAllTalks,
      variables: this.getAllTalksQueryVariables(pageNumber)
    });

    const getAllTalks$ = this.allTalkQuery
      .take(1)
      .subscribe(({data}) => this.updateData(data, pageNumber));
    this.subscriptions = this.subscriptions.concat(getAllTalks$);
  }

  private refreshTalks(pageNumber = START_PAGE) {
    return this.allTalkQuery.refetch(this.getAllTalksQueryVariables(pageNumber))
      .then(({data}) => {
        this.updateData(data, pageNumber);
        return data;
      });
  }

  deleteTalk(id) {
    const deleteTalk$ = this.apollo.mutate({
      mutation: deleteTalk,
      variables: {
        id: id
      }
    }).switchMap(_ => this.refreshTalks(START_PAGE))
      .take(1)
      .subscribe();

    this.subscriptions = this.subscriptions.concat(deleteTalk$);
  }

  ngOnDestroy() {
    unsubscribeAll(this.subscriptions);
  }

}
