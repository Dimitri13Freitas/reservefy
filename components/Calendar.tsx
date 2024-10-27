import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ícones do expo/vector-icons
import Colors from "@/constants/Colors";

interface Reservation {
  id: number;
  date: Date;
  description: string;
  startTime: string;
  endTime: string;
}

interface CalendarProps {
  initialDate?: Date;
  reservations?: Reservation[];
}

const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  reservations = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

  const daysOfWeek = ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sab."];
  const today = new Date();

  const formatMonthYear = (date: Date) => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(startDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      week.push(date);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const hasReservation = (date: Date) => {
    return reservations.some((reservation) =>
      isSameDay(reservation.date, date),
    );
  };

  const weeks = generateCalendar();

  return (
    <View style={{ position: "relative", zIndex: -99 }}>
      {/* Cabeçalho do Calendário */}
      <View style={[styles.header]}>
        <Text style={styles.monthText}>{formatMonthYear(currentMonth)}</Text>
        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Ionicons
              name="chevron-back-outline"
              size={24}
              style={[styles.mounthButton]}
              color={Colors.white.main}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              style={[styles.mounthButton]}
              color={Colors.white.main}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.daysHeader}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
      </View>

      <View>
        {weeks.map((week, i) => (
          <View key={i} style={styles.week}>
            {week.map((date, j) => (
              <View key={j} style={styles.day}>
                {date ? (
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      hasReservation(date) && styles.reservedDate,
                      isSameDay(date, today) && styles.todayDate, // Aplica estilo adicional se for o dia atual
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        hasReservation(date) && styles.dateReservedText,
                        isSameDay(date, today) && styles.todayDateText, // Estilo para o texto do dia atual
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.emptyDay}></Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  mounthButton: {
    backgroundColor: Colors.secundary.main,
    padding: 5,
    borderRadius: 10,
  },
  monthText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.secundary.main,
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    backgroundColor: Colors.white.main,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dayLabel: {
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.secundary.main,
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  day: {
    width: 40,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButton: {
    width: 40,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  reservedDate: {
    backgroundColor: Colors.primary.main,
  },
  dateText: {
    fontSize: 14,
    color: Colors.secundary.main,
  },
  dateReservedText: {
    color: Colors.white.main,
    fontWeight: "bold",
  },
  emptyDay: {
    width: 40,
    height: 32,
  },
  todayDate: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  todayDateText: {
    color: Colors.primary.main,
  },
});

export default Calendar;
