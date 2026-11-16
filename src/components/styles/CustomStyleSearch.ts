import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const CustomStyleSearch = `
  .rdrDefinedRangesWrapper {
    display: none;
  }
  .rdrCalendarWrapper,
  .rdrMonth,
  .rdrMonthsHorizontal,
  .rdrMonthsVertical,
  .rdrMonths,
  .rdrMonthAndYearWrapper,
  .rdrWeekDays,
  .rdrDays {
    background: #fff !important;
  }
  .rdrDayNumber span {
    color: #000 !important;
    font-size: 14px;
    font-weight: 400;
    background: none !important;
  }
  .rdrDayDisabled, .rdrDayPassive {
    background: #fff !important;
  }
  .rdrDay {
    background: #fff !important;
  }
  .rdrDay.rdrDayStartPreview, 
  .rdrDay.rdrDayEndPreview, 
  .rdrDay.rdrDayInPreview, 
  .rdrDay.rdrDayStartOfWeek, 
  .rdrDay.rdrDayEndOfWeek,
  .rdrDay.rdrDayStartOfMonth,
  .rdrDay.rdrDayEndOfMonth,
  .rdrDay.rdrDayInRange {
    background: #fff !important;
    color: #000 !important;
    box-shadow: none !important;
  }
  .rdrDay.rdrDayInRange .rdrDayNumber span,
  .rdrDay.rdrDayStartEdge .rdrDayNumber span,
  .rdrDay.rdrDayEndEdge .rdrDayNumber span {
    background: #000 !important;
    color: #000 !important;
    border-radius: 50% !important;
    padding: 0 7px !important;
  }
  .rdrDayToday .rdrDayNumber span {
    border: 1.5px solid #000 !important;
    border-radius: 50%;
  }
  .rdrDay.rdrDaySelected .rdrDayNumber span {
    background: #000 !important;
    color: #fff !important;
  }
  .rdrInRange, .rdrStartEdge, .rdrEndEdge {
    box-shadow: none !important;
    background: #fff !important;
  }
`;
export default CustomStyleSearch;