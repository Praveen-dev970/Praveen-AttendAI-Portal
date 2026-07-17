import math


class AttendanceCalculator:

    @staticmethod
    def calculate_summary(attendance_data: list) -> dict[str, float | int]:

        total_held = sum(item.held for item in attendance_data)
        total_attended = sum(item.attended for item in attendance_data)

        if total_held == 0:
            overall = 0.0
        else:
            overall = round((total_attended / total_held) * 100, 2)

        return {
            "total_held": total_held,
            "total_attended": total_attended,
            "overall_percentage": overall
        }

    @staticmethod
    def classes_needed(
        held: int,
        attended: int,
        target: float
    ):

        if held == 0:
            return 0

        current = (attended / held) * 100

        if current >= target:
            return 0

        x = math.ceil(
            ((target * held) - (100 * attended))
            / (100 - target)
        )

        return max(0, x)

    @staticmethod
    def safe_leaves(
        held: int,
        attended: int,
        target: float
    ):

        if held == 0:
            return 0

        if (attended / held) * 100 < target:
            return 0

        x = math.floor(
            (attended - (target / 100) * held)
            / (target / 100)
        )

        return max(0, x)
    


    @staticmethod
    def required_classes(total_held: int, total_attended: int, target: float) -> int:
        """
        Returns how many consecutive classes must be attended
        to reach the target attendance percentage.
        """

        current = (
            total_attended / total_held * 100
            if total_held > 0
            else 0
        )

        if current >= target:
            return 0

        required = math.ceil(
            (target * total_held - 100 * total_attended)
            / (100 - target)
        )

        return max(required, 0)
