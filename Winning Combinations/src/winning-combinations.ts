
type WinningCombinationsResult = [number, number[]][];

function call(lines: number[]): WinningCombinationsResult {
  const result: WinningCombinationsResult = [];
  const items: number[] = [];
  const itensPositions: number[][] = [];
  lines.forEach((item, index)=> {
    // The paying symbols are only the ones that are less than 10
    if(item < 10) {
      let i = items.indexOf(item);
      // When it doesn't find the item in the items array, it adds the item in the items array and adds the item's position in the items arrayPositions
      if (i === -1) {
        items.push(item)
        if(lines[index -1] === 0) {
          const zeroIndex = items.indexOf(0)
          const zeroPositions = itensPositions[zeroIndex]
          for (const element of zeroPositions) {
            itensPositions[items.indexOf(item)] ? itensPositions[items.length - 1].push(element) : itensPositions.push([element])
            itensPositions[zeroIndex].shift()
          }
          itensPositions[items.length - 1].push(index)
        } else {
          itensPositions.push([index])
        }
      } else if (index - 1 === itensPositions[i][itensPositions[i].length - 1]) {
        itensPositions[i].push(index)
      } else if(itensPositions[i].length < 3){
        itensPositions[i] = [index]
      }
      // Special verification for the wild symbol
      if(item === 0 ) {
        itensPositions.forEach((itemPositions, itemPositionsIndex) => {
          if(itemPositions.includes(index - 1)) {
            itensPositions[itemPositionsIndex].push(index)
          }
        })
      }
    }
  })

  itensPositions.forEach((itemPosition, index)=> {
    let uniqueItems = [...new Set(itemPosition)]
    if (uniqueItems.length >= 3) {
      result.push([items[index], uniqueItems])
    }
    //If there was a zero as an item and there is already another item with a higher value in addition to it, it must be removed
    if (result.length> 1 && result[result.length - 1][0] === 0) {
      result.pop()
    }
  });
  return result;
}
export const WinningCombinations = { call };
