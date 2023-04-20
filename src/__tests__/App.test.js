import { render, screen } from "@testing-library/react"
import { Connectapp } from '../index'


test("reverse the date in the format of dd-mm-yy correctly", () => {
  let Appointmentcomponent = render(<Connectapp />)
  const currentValue = '2000-03-03'
  let Reverse = Appointmentcomponent.reversefunction(currentValue)
  expect(Reverse).toBe('03-03-2000')
})