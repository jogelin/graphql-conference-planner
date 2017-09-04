import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { unsubscribeAll } from '../../utils';
import { Talk } from '../types';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/empty';
import { GetTalkByIdQuery, GetTalkByIdQueryResponse } from '../talk.apollo-query';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'cp-talk-details',
  templateUrl: './talk-details.component.html'
})
export class TalkDetailsComponent implements OnInit, OnDestroy {
  loading: boolean;
  talk: Talk;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.getTalkDetails = this.getTalkDetails.bind(this);
  }

  ngOnInit() {
    const getTalkDetails$ = this.route.paramMap
      .map((params: ParamMap) => params.get('id'))
      .switchMap(this.getTalkDetails)
      .subscribe(({data}) => {
        this.loading = data.loading;
        this.talk = data.talk;
      });

    this.subscriptions = this.subscriptions.concat(getTalkDetails$);
  }

  getTalkDetails(talkId: string) {
    return this.apollo.watchQuery<GetTalkByIdQueryResponse>({
      query: GetTalkByIdQuery,
      variables: {
        id: talkId
      }
    });
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
