import { Feeling } from '../../models/Models';

enum textValues {
  lust = 'text-lust',
  gluttony = 'text-gluttony',
  greed = 'text-greed',
  sloth = 'text-sloth',
  wrath = 'text-wrath',
  pride = 'text-pride',
  envy = 'text-envy',
  chastity = 'text-chastity',
  temperance = 'text-temperance',
  charity = 'text-charity',
  diligence = 'text-diligence',
  patience = 'text-patience',
  humility = 'text-humility',
  kindness = 'text-kindness',
}

enum bgValues {
  lust = 'bg-lust',
  gluttony = 'bg-gluttony',
  greed = 'bg-greed',
  sloth = 'bg-sloth',
  wrath = 'bg-wrath',
  pride = 'bg-pride',
  envy = 'bg-envy',
  chastity = 'bg-chastity',
  temperance = 'bg-temperance',
  charity = 'bg-charity',
  diligence = 'bg-diligence',
  patience = 'bg-patience',
  humility = 'bg-humility',
  kindness = 'bg-kindness',
}

export function textColorPicker(feeling: Feeling): textValues {
  const biggestSin = Object.keys(feeling.values)
    .sort((sinA, sinB) => feeling.values[sinA] - feeling.values[sinB])
    .at(-1);

  switch (biggestSin) {
    case 'charity':
      return textValues.charity;
    case 'chastity':
      return textValues.chastity;
    case 'diligence':
      return textValues.diligence;
    case 'envy':
      return textValues.envy;
    case 'gluttony':
      return textValues.gluttony;
    case 'greed':
      return textValues.greed;
    case 'humility':
      return textValues.humility;
    case 'kindness':
      return textValues.kindness;
    case 'lust':
      return textValues.lust;
    case 'patience':
      return textValues.patience;
    case 'pride':
      return textValues.pride;
    case 'sloth':
      return textValues.sloth;
    case 'temperance':
      return textValues.temperance;
    case 'wrath':
      return textValues.wrath;
    default:
      return textValues.charity;
      break;
  }
}

export function bgColorPicker(feeling: Feeling): bgValues {
  const biggestSin = Object.keys(feeling.values)
    .sort((sinA, sinB) => feeling.values[sinA] - feeling.values[sinB])
    .at(-1);

  switch (biggestSin) {
    case 'charity':
      return bgValues.charity;
    case 'chastity':
      return bgValues.chastity;
    case 'diligence':
      return bgValues.diligence;
    case 'envy':
      return bgValues.envy;
    case 'gluttony':
      return bgValues.gluttony;
    case 'greed':
      return bgValues.greed;
    case 'humility':
      return bgValues.humility;
    case 'kindness':
      return bgValues.kindness;
    case 'lust':
      return bgValues.lust;
    case 'patience':
      return bgValues.patience;
    case 'pride':
      return bgValues.pride;
    case 'sloth':
      return bgValues.sloth;
    case 'temperance':
      return bgValues.temperance;
    case 'wrath':
      return bgValues.wrath;
    default:
      return bgValues.charity;
      break;
  }
}
