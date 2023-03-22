import { render, fireEvent } from '@testing-library/react';
import {Navbar,Appointments,Pharmacy,DailySaleReport,Patients,Doctors} from '../App';

describe('Date reverse function', () => {
  it('reverses the date correctly', () => {
    const { getByLabelText, getByTestId } = render(<Appointments />);

    // Find the input field and set its value to a sample date
    const input = getByLabelText('Date Input');
    fireEvent.change(input, { target: { value: '2022-03-21' } });

    // Find the "Reverse Date" button and click it
    const reverseButton = getByTestId('reverse-date-button');
    fireEvent.click(reverseButton);

    // Find the element that displays the reversed date and verify its text content
    const reversedDate = getByTestId('reversed-date');
    expect(reversedDate.textContent).toEqual('21-03-2022');
  });
});
