export class Word {

    constructor(word: any) {
        this.uuid = word.uuid;
        this.word = word.word;
        this.translation = word.translation;
        this.pronunciation = word.pronunciation;
        this.profile_uuid = word.profile_uuid;
        this.audioPath = word.audioPath;
        this.dateSpeaker = word.dateSpeaker;
    }
    
    public uuid: string = '';
	public word: string = '';
    public translation: string = '';
    public pronunciation: string = '';
    public audioPath: string = '';
    public dateSpeaker: Date = new Date(Date.now());
    public profile_uuid: string = '';
    public isWordNoSync(): boolean {
        return this.uuid == undefined || this.uuid.includes('no-sync:')
    }
}


