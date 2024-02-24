export function distinguishCardKind(cardList: any): any {

    let firstCard = cardList[0]
    let secondCard = cardList[1]
    if (firstCard.rank === secondCard.rank) {
        return exchangeLetter(firstCard.rank, secondCard.rank)
    } else if (firstCard.rank !== secondCard.rank && firstCard.suit === secondCard.suit) {
        return exchangeLetter(firstCard.rank, secondCard.rank).concat("s")
    } else if (firstCard.rank !== secondCard.rank && firstCard.suit !== secondCard.suit) {
        return exchangeLetter(firstCard.rank, secondCard.rank).concat("o")
    }
}

export function exchangeLetter(first: string, second: string) {

    let firstOrder = cardArray.indexOf(first)
    let secondOrder = cardArray.indexOf(second)

    let bufferFirst = ""
    let bufferSecond = ""

    if (firstOrder > secondOrder) {
        bufferFirst = first
        bufferSecond = second
    } else {
        bufferFirst = second
        bufferSecond = first
    }

    return bufferFirst.concat(bufferSecond)
}

export const cardArray = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]