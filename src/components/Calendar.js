import Calendar from "react-awesome-calendar";

export default function CalendarComponent({ events, handleClickEvent }) {
  return (
    <Calendar
      events={events}
      mode={"dailyMode"}
      onClickEvent={handleClickEvent}
    />
  );
}
