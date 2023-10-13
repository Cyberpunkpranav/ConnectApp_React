export const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }