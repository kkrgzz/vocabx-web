import Campfire from 'assets/images/vectors/campfire.svg';
import CountingStars from 'assets/images/vectors/counting-stars.svg';
import MyUniverse from 'assets/images/vectors/my-universe.svg';
import PageNotFound from 'assets/images/vectors/page-not-found.svg';
import ReadingTime from 'assets/images/vectors/reading-time.svg';
import RelaxMode from 'assets/images/vectors/relax-mode.svg';
import SpaceExploration from 'assets/images/vectors/space-exploration.svg';
import ToTheMoon from 'assets/images/vectors/to-the-moon.svg';

const vectorImages = {
  campfire: Campfire,
  countingStars: CountingStars,
  myUniverse: MyUniverse,
  //pageNotFound: PageNotFound,
  readingTime: ReadingTime,
  relaxMode: RelaxMode,
  spaceExploration: SpaceExploration,
  toTheMoon: ToTheMoon,
};

export const getRandomVectorImage = () => {
  const keys = Object.keys(vectorImages);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return vectorImages[randomKey];
};

export default vectorImages;