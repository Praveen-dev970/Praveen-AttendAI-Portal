import json
from bs4 import BeautifulSoup


class AttendanceParser:

    @staticmethod
    def parse(response_text: str):

        data = json.loads(response_text)

        html = data["d"]

        soup = BeautifulSoup(html, "lxml")

        subjects = []

        overall = {
            "held": 0,
            "attended": 0,
            "percentage": 0
        }

        # Subject rows
        for row in soup.select("tr.reportData1"):

            cols = row.find_all("td")

            if len(cols) >= 5:

                subjects.append({

                    "subject": cols[1].get_text(strip=True),

                    "held": int(cols[2].get_text(strip=True) or 0),

                    "attended": int(cols[3].get_text(strip=True) or 0),

                    "percentage": float(cols[4].get_text(strip=True) or 0)

                })

        # Total row
        for row in soup.select("tr.reportHeading2WithBackground"):

            text = row.get_text().upper()

            if "TOTAL" in text:

                cols = row.find_all("td")

                if len(cols) >= 4:

                    overall = {

                        "held": int(cols[1].get_text(strip=True)),

                        "attended": int(cols[2].get_text(strip=True)),

                        "percentage": float(cols[3].get_text(strip=True))

                    }

        return {

            "subjects": subjects,

            "overall": overall

        }