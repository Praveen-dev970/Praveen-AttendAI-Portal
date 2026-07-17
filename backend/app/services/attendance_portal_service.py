from __future__ import annotations

from datetime import date, timedelta

from app.clients.aec_client import AECClient
from app.parser.attendance_parser import AttendanceParser

from collections import defaultdict


class AttendancePortalService:
    @staticmethod
    def _portal_date(value: date) -> str:
        return value.strftime("%d/%m/%Y")

    @classmethod
    def fetch(cls, client: AECClient, *, current_date: date | None = None) -> dict:
        """Fetch the official overall, today, and yesterday attendance views."""
        today_date = current_date or date.today()
        yesterday_date = today_date - timedelta(days=1)

        overall_response = client.get_attendance()
        today_value = cls._portal_date(today_date)
        yesterday_value = cls._portal_date(yesterday_date)

        overall = AttendanceParser.parse(overall_response)

        today_date = AttendanceParser.parse(
            client.get_attendance(today_value, today_value)
        )

        yesterday_date = AttendanceParser.parse(
            client.get_attendance(yesterday_value, yesterday_value)
        )

        return {
            "overall": overall,
            "today": cls._aggregate_period(today_date),
            "yesterday": cls._aggregate_period(yesterday_date),
        }



    @staticmethod
    def _aggregate_period(period: dict) -> dict:
        grouped = defaultdict(lambda: {
            "held": 0,
            "attended": 0,
        })

        for subject in period.get("subjects", []):
            row = grouped[subject["subject"]]
            row["held"] += subject["held"]
            row["attended"] += subject["attended"]

        subjects = []

        for name, row in grouped.items():
            held = row["held"]
            attended = row["attended"]

            subjects.append({
                "subject": name,
                "held": held,
                "attended": attended,
                "absent": held - attended,
                "percentage": round(attended * 100 / held, 2) if held else 0,
            })

        overall = period.get("overall", {})

        return {
            "date": period.get("date"),
            "summary": {
                "held": overall.get("held", 0),
                "attended": overall.get("attended", 0),
                "absent": overall.get("held", 0) - overall.get("attended", 0),
                "percentage": overall.get("percentage", 0),
            },
            "subjects": subjects,
        }