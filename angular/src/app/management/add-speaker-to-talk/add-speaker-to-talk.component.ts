import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Speaker} from '../../speaker/types';
import {Subscription} from 'rxjs/Subscription';
import {unsubscribeAll} from '../../utils';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { Apollo } from 'apollo-angular';
import { getSpeakers, GetSpeakersResponse, updateTalk, updateTalkSpeaker } from 'app/management/management.apollo-query';

@Component({
  selector: 'cp-add-speaker-to-talk',
  templateUrl: './add-speaker-to-talk.component.html'
})
export class AddSpeakerToTalkComponent implements OnInit, OnDestroy {

  speakerOnTalk: Speaker;
  speakers: [Speaker];
  talkIdParam: string;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.talkIdParam = this.route.snapshot.params['id'];
    this.addSpeaker = this.addSpeaker.bind(this);
    this.deleteSpeaker = this.deleteSpeaker.bind(this);
  }

  ngOnInit() {
    this.getSpeakersAndSpeakersOnTalk();
  }

  getSpeakersAndSpeakersOnTalk() {
    const getSpeakers$ = this.apollo.watchQuery<GetSpeakersResponse>({
      query: getSpeakers
    })
      .subscribe(({ data }) => {
      this.speakers = data.speakers;
      this.speakerOnTalk = this.getSpeakerOnTalk(data.speakers);
    });

    this.subscriptions = this.subscriptions.concat(getSpeakers$);
  }

  getSpeakerOnTalk(speakers: Speaker[]): Speaker {
    return speakers.find(speaker => {
      return speaker.talks.some(talk => talk.id === this.talkIdParam);
    });
  }

  addSpeaker(speakerId) {
    const updateTalkSpeaker$ = this.apollo.mutate({
      mutation: updateTalkSpeaker,
      variables: {
        id: this.talkIdParam,
        speakerId: speakerId
      }
    }).subscribe(_ => {
      this.speakerOnTalk = this.speakers.find(speaker => speaker.id === speakerId);
    });

    this.subscriptions = this.subscriptions.concat(updateTalkSpeaker$);
  }

  deleteSpeaker() {
    const updateTalkSpeaker$ = this.apollo.mutate({
      mutation: updateTalkSpeaker,
      variables: {
        id: this.talkIdParam,
        speakerId: null
      }
    }).subscribe(_ => {
      this.speakerOnTalk = null;
    });

    this.subscriptions = this.subscriptions.concat(updateTalkSpeaker$);
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
