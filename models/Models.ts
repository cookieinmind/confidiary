export type JournalEntry = {
  date: Date;
  feeling: string;
  why: string;
  uid: string;
};

export type Thought = {
  day: string;
  created: string;
  feeling: string;
  why: string;
};

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
