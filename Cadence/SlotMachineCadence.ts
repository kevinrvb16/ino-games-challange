type AnticipatorConfig = {
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};
//Defines data entry types for anticipation

type SlotCoordinate = {
  column: number;
  row: number;
};
//Coordinates of a special symbol

type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };
// Array with the coordinates of all special symbols of the round

type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};
//Defines data entry types for each round

type SlotCadence = Array<number>;
//Defines the data output types for a round

type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};
//Define data output types for each round

/**
 * Anticipator configuration. Has all information needed to check anticipator.
 * @param columnSize It's the number of columns the slot machine has.
 * @param minToAnticipate It's the minimum number of symbols to start anticipation.
 * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
 * @param anticipateCadence It's the cadence value when has anticipation.
 * @param defaultCadence It's the cadence value when don't has anticipation.
 */
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 5,
  minToAnticipate: 2,
  maxToAnticipate: 3,
  anticipateCadence: 2,
  defaultCadence: 0.25,
};

/**
 * Game rounds with special symbols position that must be used to generate the SlotCadences.
 */
const gameRounds: RoundsSymbols = {
  roundOne: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 1, row: 3 },
      { column: 3, row: 4 },
    ],
  },
  roundTwo: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 0, row: 3 },
    ],
  },
  roundThree: {
    specialSymbols: [
      { column: 4, row: 2 },
      { column: 4, row: 3 },
    ],
  },
};

/**
 * This must be used to get all game rounds cadences.
 */
const slotMachineCadences: RoundsCadences = {
  roundOne: [],
  roundTwo: [],
  roundThree: [],
};

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
 */
function slotCadence(symbols: Array<SlotCoordinate>): SlotCadence {
  //Defining the initial value of the array as 0, because the cadence only changes in the next column of the column with the special symbol
  const cadence: SlotCadence = [0];

  //Initialized the values that will later be used to define the interval that will undergo the anticipation of the cadence.  
  const startAnticipate: number = symbols[anticipatorConfig.minToAnticipate - 1]?.column
  const endAnticipate:  number = symbols[anticipatorConfig.maxToAnticipate - 1]?.column

  //The for loop should only perform 4 pushes in this 5-column example, as the first value has already been set to 0
  for(let i=0; i< anticipatorConfig.columnSize-1; i++){
    /* If the current column is within the interval of anticipation, the cadence is set to the value of the anticipation cadence
    Also the symbols that define the start and end of the anticipation cannot be in the same column */
    startAnticipate <= i && (!endAnticipate ||endAnticipate > i) && startAnticipate !== endAnticipate ?
      cadence.push(anticipatorConfig.anticipateCadence + cadence[i])
    :
      cadence.push(anticipatorConfig.defaultCadence + cadence[i])
  }
  return cadence;
}

/**
 * Get all game rounds and return the final cadences of each.
 * @param rounds RoundsSymbols with contains all rounds special symbols positions.
 * @return RoundsCadences has all cadences for each game round.
 */
function handleCadences(rounds: RoundsSymbols): RoundsCadences {
  slotMachineCadences.roundOne = slotCadence(rounds.roundOne.specialSymbols);
  slotMachineCadences.roundTwo = slotCadence(rounds.roundTwo.specialSymbols);
  slotMachineCadences.roundThree = slotCadence(
    rounds.roundThree.specialSymbols
  );

  return slotMachineCadences;
}

console.log("CADENCES: ", handleCadences(gameRounds));
