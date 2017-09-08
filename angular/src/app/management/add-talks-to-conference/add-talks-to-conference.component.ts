import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {unsubscribeAll} from '../../utils';
import {Talk} from '../../talk/types';
import 'rxjs/add/observable/empty';
import {Observable} from 'rxjs/Observable';
import {
  getTalksOnConference, GetTalksOnConferenceResponse,
  updateTalksOnConference
} from '../management.apollo-query';
import { Apollo } from 'apollo-angular/build/src';

@Component({
  selector: 'cp-add-talks-to-conference',
  templateUrl: './add-talks-to-conference.component.html'
})
export class AddTalksToConferenceComponent implements OnInit, OnDestroy {
  talksOnConference: Talk[] = [];
  talks: Talk[] = [];
  conferenceIdParam: string;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.conferenceIdParam = this.route.snapshot.params['id'];
    this.addTalk = this.addTalk.bind(this);
    this.deleteTalk = this.deleteTalk.bind(this);
  }

  ngOnInit() {
    this.getTalksAndTalksOnConference();
  }

  getTalksAndTalksOnConference() {
    const getTalksOnConference$ = this.apollo.watchQuery<GetTalksOnConferenceResponse>({
      query: getTalksOnConference
    })
      .subscribe(({ data }) => {
        this.talks = data.talks;
        this.talksOnConference = this.getTalksOnConference(data.talks);
      });

    this.subscriptions = this.subscriptions.concat(getTalksOnConference$);
  }

  getTalksOnConference(talks: Talk[] = []): Talk[] {
    return talks.filter(talk => {
      return talk.conferences.some(conference => conference.id === this.conferenceIdParam);
    });
  }

  addTalk(talkId) {
    const updateTalksOnConference$ = this.apollo.mutate({
      mutation: updateTalksOnConference,
      variables: {
        id: this.conferenceIdParam,
        talksIds: this.talksOnConference.map(talk => talk.id).concat(talkId)
      }
    }).subscribe(_ => {
      const talkToAdd = this.talks.find(talk => talk.id === talkId);
      this.talksOnConference = this.talksOnConference
        .concat(this.talksOnConference.includes(talkToAdd) ? [] : talkToAdd);
    });

    this.subscriptions = this.subscriptions.concat(updateTalksOnConference$);
  }

  deleteTalk(talkId: string) {
    const updateTalksOnConference$ = this.apollo.mutate({
      mutation: updateTalksOnConference,
      variables: {
        id: this.conferenceIdParam,
        talksIds: this.talksOnConference.map(talk => talk.id).filter(id => talkId !== id)
      }
    }).subscribe(_ => {
      this.talksOnConference = this.talksOnConference
        .filter(talk => talk.id !== talkId);
    });

    this.subscriptions = this.subscriptions.concat(updateTalksOnConference$);
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
