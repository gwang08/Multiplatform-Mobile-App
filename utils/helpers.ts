export const formatMinutesToHours = (minutes: number): string => {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
    return '0h 0m';
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatPassingAccuracy = (accuracy: number): string => {
  if (typeof accuracy !== 'number' || isNaN(accuracy) || accuracy < 0) {
    return '0%';
  }
  return `${(accuracy * 100).toFixed(1)}%`;
};

export const calculateAge = (yearOfBirth: number): number => {
  if (typeof yearOfBirth !== 'number' || isNaN(yearOfBirth) || yearOfBirth < 1900) {
    return 0;
  }
  const currentYear = new Date().getFullYear();
  return currentYear - yearOfBirth;
};

export const getPlayerPosition = (position: string): string => {
  if (typeof position !== 'string' || !position) {
    return 'N/A';
  }
  const positions: { [key: string]: string } = {
    'Forward': 'FW',
    'Midfielder': 'MF',
    'Defender': 'DF',
    'Goalkeeper': 'GK'
  };
  return positions[position] || position;
};

export const getRatingStars = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

export const groupFeedbacksByRating = (feedbacks: any[]) => {
  const grouped = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.rating]) {
      acc[feedback.rating] = [];
    }
    acc[feedback.rating].push(feedback);
    return acc;
  }, {} as { [key: number]: any[] });

  return Object.keys(grouped)
    .map(rating => ({
      rating: parseInt(rating),
      count: grouped[parseInt(rating)].length,
      feedbacks: grouped[parseInt(rating)]
    }))
    .sort((a, b) => b.rating - a.rating);
};
