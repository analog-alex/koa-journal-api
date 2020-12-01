export class TextParse {

  private static SPACE = ' ';
  private static AVG_WORDS_PER_LINE = 20;

  public static analyse(text: string): TextAnalysisResult {

    const words: string[] = text.split(this.SPACE);

    const result = new TextAnalysisResult();
    result.lines = words.length / this.AVG_WORDS_PER_LINE;
    result.words = words.length;
    result.averageSizeOfWords = words
                        .map(word => word.length)
                        .reduce((l, r) => l + r) / words.length;
    result.rating = this.calculateReadingTime(
        result.lines, this.AVG_WORDS_PER_LINE, result.averageSizeOfWords);

    return result;
  }

  private static calculateReadingTime(
      lines: number, numberOfWordsPerLine: number, avgSize: number) {

    /*
        let us suppose that a line of text contains twenty words
        and that the average person take 1 second to read a letter
        then, we calculate the reading time by calculating the time
        it takes to read a line multipied by the number of lines
    */

    return Math.floor((avgSize * numberOfWordsPerLine * lines) /* seconds */ / 60);
  }
}

/*
 * Container class for text analysis results
 */
class TextAnalysisResult {

  public lines: number;
  public words: number;
  public averageSizeOfWords: number;
  public rating: number;
}
