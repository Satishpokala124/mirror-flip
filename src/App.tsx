import { useEffect, useState } from 'react';
import { generator, ImageProps, Case, Orientation } from './generator';
import './App.css';

type Score = { correct: number; total: number };
const options = [0, 1, 2, 3];

function App() {
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [images, setImages] = useState<Array<Case | null>>([null, null, null]);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const evaluate = (option: number) => {
    if (!startedAt) setStartedAt(new Date());
    const correctAns = images.filter((image) => image?.[1].mirror === image?.[2].mirror).length;
    
    setScore(({ correct, total }) => {
      let newScore;
      if (correctAns === option) {
        newScore = { correct: correct + 1, total: total + 1 };
      } else {
        newScore = { correct, total: total + 1 };
      }
      generateNewImages();
      return newScore;
    });
  };

  const generateNewImages = () => {
    setImages((prevImages) => {
      return prevImages.map(() => {
        return generator();
      });
    });
  };

  const showTimer = () => {
    if (!startedAt) return '0:0:0';
    const milliseconds = currentTime.getTime() - startedAt.getTime();
    let seconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    generateNewImages();
    setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, []);

  return (
    <main>
      <h1 className='text-4xl font-bold'>Mirror Flip</h1>
      <section>
        <p className='text-2xl p-8'>
          Score: <span className='font-bold'>{`${score.correct}/${score.total}`}</span>
        </p>
        <p className='pb-4'>{`Timer: ${showTimer()}`}</p>
      </section>
      <div className='flex w-full justify-center items-center gap-8'>
        {images.map((image, index) => {
          if (!image) return null;

          return (
            <div
              key={index}
              className='flex flex-col gap-4 border-violet-300 border-x-[1.5rem] border-y-[1rem] px-4 py-2'
            >
              <Image key={`${index}-1`} {...image['1']} />
              <Image key={`${index}-2`} {...image['2']} />
            </div>
          );
        })}
      </div>
      <p className='text-sm md:text-lg mt-4 mb-2'>How many pairs are not vertically mirrored?</p>
      <div className='flex justify-center gap-4'>
        {options.map((option, index) => (
          <button
            key={index}
            className='p-4 text-2xl border border-violet-700 rounded-sm bg-violet-100'
            onClick={() => evaluate(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className='px-4 py-2 mt-8 border border-gray-600 rounded-sm bg-gray-200'
        onClick={() => {
          generateNewImages();
          setScore({ correct: 0, total: 0 });
          setStartedAt(null);
        }}
      >
        Reset
      </button>
    </main>
  );
}

export default App;

const Image = ({ mirror, rotation }: ImageProps) => {
  const rotations: Record<Orientation, string> = {
    '1': 'rotate-0',
    '2': 'rotate-90',
    '3': 'rotate-180',
    '4': 'rotate-270',
  };

  return (
    <div>
      <img
        src='R.png'
        className={`min-w-4 ${mirror ? '-scale-x-100' : 'rotate-[360deg]'} ${rotations[rotation]}`}
      />
    </div>
  );
};

const Score = ({ correct, total }: { correct: number; total: number }) => {
  return (
    <div>
      {correct}/{total}
    </div>
  );
};
