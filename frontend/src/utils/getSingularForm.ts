export default function getSingularForm(word: string): string {
    if (word.endsWith('ies')) {
        return word.slice(0, -3) + 'y';
    } else if (word.endsWith('s')) {
        return word.slice(0, -1);
    }

    return word;
}