const generateTimeSlots = (start, end, intervalMins) => {
  const slots = [];

  for (let i = start * 60; i <= end * 60; i += intervalMins) {
    const h = Math.floor(i / 60);
    const m = i % 60;

    const nextTotalMins = i + intervalMins;
    const nextH = Math.floor(nextTotalMins / 60);
    const nextM = nextTotalMins % 60;

    if (nextH === end && nextM > 45) break;

    slots.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} - ${String(
        nextH
      ).padStart(2, "0")}:${String(nextM).padStart(2, "0")}`
    );
  }

  return slots;
};

const time = generateTimeSlots(8, 23, 60);


export { time };