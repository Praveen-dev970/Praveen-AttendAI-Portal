from bs4 import BeautifulSoup


class AttendanceParser:

    @staticmethod
    def parse(html: str):

        soup = BeautifulSoup(html, "lxml")

        table = soup.find("table", class_="cellBorder")

        if table is None:
            return []

        rows = table.find_all("tr")

        attendance = []

        for row in rows[1:]:

            cols = row.find_all("td")

            if len(cols) != 5:
                continue

            subject = cols[1].text.strip()

            if subject.upper() == "TOTAL":
                continue

            attendance.append({

                "subject": subject,

                "held": int(cols[2].text.strip()),

                "attended": int(cols[3].text.strip()),

                "percentage": float(cols[4].text.strip())

            })

        return attendance