import React, { useState } from "react";
import type { FC } from "react";
import CalendarUI from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TCalendarValue } from "./types";
import s from "./Calendar.module.scss";
import Modal from "../Modal/Modal";

type TProps = {
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  OnChange?: (date: Date) => void;
  value?: TCalendarValue;
} & CalendarProps;

const Calendar: FC<TProps> = (props: TProps) => {
  const { locale, maxDate, minDate, OnChange, value } = props;
  const [activeDate, setActiveDate] = useState<Date | undefined>(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);

  const handleActiveStartDateChange: CalendarProps["onActiveStartDateChange"] =
    (props) => {
      if (props.action === "prev2") {
        return;
      }
      setActiveDate(props.activeStartDate ?? undefined);
    };

  const handleClickDay = (date: Date) => {
    OnChange?.(date);
    setActiveDate(date);
    setClickedDate(date);
    setModalIsOpen(true);
  };

  const formatValueForModal = (date: Date | null) => {
    if (date instanceof Date) {
      return date.toISOString();
    }
    return "";
  };

  return (
    <>
      <CalendarUI
        {...props}
        activeStartDate={activeDate}
        className={s.calendar}
        locale={locale}
        maxDate={maxDate}
        minDate={minDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        onClickDay={handleClickDay}
        tileClassName="calendar-DayTile"
        value={value}
      />

      <Modal
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
        value={formatValueForModal(clickedDate)}
      />
    </>
  );
};

export default Calendar;
