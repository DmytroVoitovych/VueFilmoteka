export const getSegmentWidth = (
  circle: number,
  segmentWidth: number,
  numSegments: number
): string => {
  switch (numSegments) {
    case 6:
      return '58%';
    case 5:
      return '74%';
    case 4:
      return '100%';
    case 3:
      return '174%';
    case 2:
      return '100%';
    case 1:
      return '100%';
    default:
      return `calc((${circle}px + ${segmentWidth}px) / (${numSegments} - 1) )`;
  }
};
