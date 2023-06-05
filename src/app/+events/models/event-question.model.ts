import { ChoiceModel } from './event-question-choice.model';
export class Question {
  id: string;
  totalAnswers: number;
  question: string;
  sortOrder: number;
  choices: ChoiceModel[];
}
