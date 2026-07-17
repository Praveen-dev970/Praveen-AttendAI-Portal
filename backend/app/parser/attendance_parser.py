from __future__ import annotations

import json

from bs4 import BeautifulSoup


class AttendanceParser:
    @staticmethod
    def _number(value: str) -> float:
        cleaned = value.strip().replace("%", "").replace(",", "")
        return float(cleaned) if cleaned else 0.0

    @classmethod
    def parse(cls, response_text: str) -> dict:
        """Parse an AEC ShowAttendance response without inferring attendance status."""
        payload = json.loads(response_text)
        soup = BeautifulSoup(payload["d"], "lxml")

        subjects = []
        for row in soup.select("tr.reportData1"):
            columns = row.find_all("td")
            if len(columns) < 5:
                continue

            subjects.append(
                {
                    "subject": columns[1].get_text(strip=True),
                    "held": int(cls._number(columns[2].get_text(strip=True))),
                    "attended": int(cls._number(columns[3].get_text(strip=True))),
                    "percentage": cls._number(columns[4].get_text(strip=True)),
                }
            )

        overall = {
            "held": 0,
            "attended": 0,
            "percentage": 0.0,
        }

        for row in soup.select("tr.reportHeading2WithBackground"):
            if "TOTAL" not in row.get_text(" ", strip=True).upper():
                continue

            columns = row.find_all("td")

            if len(columns) >= 4:
                overall = {
                    "held": int(cls._number(columns[1].get_text(strip=True))),
                    "attended": int(cls._number(columns[2].get_text(strip=True))),
                    "percentage": cls._number(columns[3].get_text(strip=True)),
                }

            break
        return {"subjects": subjects, "overall": overall}
