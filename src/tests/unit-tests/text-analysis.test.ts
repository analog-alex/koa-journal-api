import { TextParse } from '../../utils/text-parse';
import { expect } from 'chai';
import 'mocha';

describe('Text parsing and analysis tests', () => {

  it('should sucessfully parse a text', () => {

    const result = TextParse.analyse(textExampleOne);
    expect(result).to.be.not.null;
  });

  it('should return correct number of words', () => {

    const result = TextParse.analyse(textExampleOne);
    expect(result.words).to.equal(textExampleOne.split(' ').length);
  });

  it('should return correct number of lines', () => {

    const result = TextParse.analyse(textExampleOne);
    expect(result.lines).to.equal(textExampleOne.split(' ').length / 20);
  });
});

// test constants
const textExampleOne = `In particle physics, quantum electrodynamics (QED) is the relativistic quantum field
  theory of electrodynamics. In essence, it describes how light and matter interact and is the first theor
  where full agreement between quantum mechanics and special relativity is achieved. QED mathematically describes
  all phenomena involving electrically charged particles interacting by means of exchange of photons and represents
  the quantum counterpart of classical electromagnetism giving a complete account of matter and light interaction.`;
