export enum StorageType {
  Undefined = 'not set yet',
  Firebase = 'the user picked firebase',
  Local = 'the user picked local storage',
}

export type JournalEntry = {
  date: string;
  feelingName: string;
  why?: string;
  uid?: string;
};

// export type Thought = {
//   day: string;
//   created: string;
//   feelingName: string;
//   why: string;
// };

export type Feeling = {
  name: string;
  values: {
    charity: number;
    chastity: number;
    diligence: number;
    envy: number;
    gluttony: number;
    greed: number;
    humility: number;
    kindness: number;
    lust: number;
    patience: number;
    pride: number;
    sloth: number;
    temperance: number;
    wrath: number;
  }[];
};

export type Feeling2 = {
  name: string;
  values: {
    charity: {
      percentage: number;
      bgColor: 'bg-charity';
      textColor: 'text-charity';
      outlineColor: 'outline-charity';
    };
    chastity: number;
    diligence: number;
    envy: number;
    gluttony: number;
    greed: number;
    humility: number;
    kindness: number;
    lust: number;
    patience: number;
    pride: number;
    sloth: number;
    temperance: number;
    wrath: number;
  }[];
};

export type UserToNotify = {
  edits?: boolean;
  insights?: boolean;
  rankings?: boolean;
};
