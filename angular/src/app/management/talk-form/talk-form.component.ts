import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { timeInputToDate, timeToInput, unsubscribeAll } from '../../utils';
import 'rxjs/add/operator/filter';
import { addTalk, getTalk, GetTalkResponse, updateTalk } from '../management.apollo-query';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/empty';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'cp-talk-form',
  templateUrl: './talk-form.component.html'
})
export class TalkFormComponent implements OnInit, OnDestroy {

  idParam: String;
  showModalSuccess = false;
  subscriptions: Subscription[] = [];

  talkForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private apollo: Apollo) {

    this.setupForm();
    this.getTalk = this.getTalk.bind(this);
    this.idParam = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    const getTalk$ = this.route.paramMap
      .map((params: ParamMap) => params.get('id'))
      .filter((idParam: string) => !!idParam)
      .switchMap(this.getTalk)
      .subscribe(({data}) => {
        this.updateTalkForm(data);
      });

    this.subscriptions = this.subscriptions.concat(getTalk$);
  }

  getTalk(id) {
    return this.apollo.watchQuery<GetTalkResponse>({
      query: getTalk,
      variables: {
        id: id
      }
    });
  }

  setupForm() {
    this.talkForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      room: ['', [Validators.minLength(2), Validators.maxLength(20)]],
      startsAt: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5),
        Validators.pattern(/^[0-9]{2}\:[0-9]{2}$/)]],
    });
  }

  updateTalkForm(data: GetTalkResponse) {
    this.talkForm.patchValue({
      ...data.talk,
      startsAt: timeToInput(data.talk.startsAt)
    });
  }


  submitTalk($event) {
    $event.preventDefault();

    let {startsAt, ...talkData} = this.talkForm.value;
    startsAt = startsAt ? {startsAt: timeInputToDate(startsAt)} : {};

    const id = this.idParam ? {id: this.idParam} : {};

    const mutation = this.idParam ? updateTalk : addTalk;

    const updateOrAdd$ = this.apollo.mutate({
      mutation: mutation,
      variables: {
        ...id,
        ...talkData,
        ...startsAt
      }
    }).subscribe(_ => {
      this.showModalSuccess = true;
    }, err => console.error(err));

    this.subscriptions = this.subscriptions.concat(updateOrAdd$);
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
