export default function getSingularForm(word: string, capitalize: boolean = false): string {
    let newWord = word;

    if (word.endsWith('ies')) {
        newWord = word.slice(0, -3) + 'y';
    } else if (word.endsWith('s')) {
        newWord = word.slice(0, -1);
    }

    if (capitalize) {
        newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1);
    }

    return newWord;
}