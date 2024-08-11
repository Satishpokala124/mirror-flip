export type Orientation = '1' | '2' | '3' | '4';

export type ImageProps = { mirror: boolean; rotation: Orientation };
export type Case = { 1: ImageProps; 2: ImageProps };
export type Generator = () => Case;

export const generator: Generator = () => {
  return {
    1: {
      mirror: Math.random() > 0.5,
      rotation: Math.floor(Math.random() * 4 + 1) as unknown as Orientation,
    },
    2: {
      mirror: Math.random() > 0.5,
      rotation: Math.floor(Math.random() * 4 + 1) as unknown as Orientation,
    },
  };
};
