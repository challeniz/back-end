export class CreateChallengeDto {
    title: string;
    category: string;
    start_date: Date;
    end_date: Date;
    mainImg: string;
    description: string;
    tag: Array<String>;
    recru_open_date: Date;
    recru_end_date: Date;
}
