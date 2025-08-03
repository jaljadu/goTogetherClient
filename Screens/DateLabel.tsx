import React from 'react';
import { Text } from 'react-native';
import { appStyles } from '../styles/appStyles'; // Adjust the import as per your project

const DateLabel = ({ dateString }: { dateString: Date }) => {
  const givenDate = new Date(dateString);
  const today = new Date();

  // Normalize time for comparison
  const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const label = (() => {
    const diffTime = normalize(givenDate).getTime() - normalize(today).getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return givenDate.toLocaleDateString(); // fallback to date if not today/tomorrow
  })();

  return <Text style={appStyles.subduedText}>{label}</Text>;
};

export default DateLabel;
