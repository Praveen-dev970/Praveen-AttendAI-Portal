import re
from bs4 import BeautifulSoup


class MarksParser:

    @staticmethod
    def parse(html: str):
        ext = html.find("EXTERNAL MARKS")
        prev = html.find("PREVIOUS SEMESTERS ATTENDANCE")

        marks_html = html

        if ext != -1:
            if prev != -1:
                marks_html = html[ext:prev]
            else:
                marks_html = html[ext:]

        soup = BeautifulSoup(marks_html, "lxml")

        result = {
            "cgpa": None,
            "semesters": []
        }

        text = soup.get_text(" ", strip=True)

        m = re.search(r"CGPA[:\s]*([0-9]+(?:\.[0-9]+)?)", text)

        if m:
            result["cgpa"] = float(m.group(1))

        result["semesters"] = MarksParser.parse_semesters(soup)

        return result

    @staticmethod
    def parse_semesters(soup):
        semesters = []
        tables = soup.find_all("table")

        semester_names = [
            "I Semester",
            "II Semester",
            "III Semester",
            "IV Semester",
            "V Semester",
            "VI Semester",
            "VII Semester",
            "VIII Semester"
        ]

        for index, table in enumerate(tables):

            tokens = table.get_text("\n", strip=True).split("\n")

            if "SGPA" not in tokens:
                continue

            if "Grade" not in tokens:
                continue

            if "Credits" not in tokens:
                continue

            sgpa_index = tokens.index("SGPA")
            grade_index = tokens.index("Grade")
            credits_index = tokens.index("Credits")

            subjects = tokens[:sgpa_index]

            grades = tokens[grade_index + 1: credits_index - 1]

            sgpa = tokens[credits_index - 1]

            credits = tokens[credits_index + 1:]

            semester = {
                "semester": semester_names[index] if index < len(semester_names) else f"Semester {index+1}",
                "sgpa": float(sgpa),
                "subjects": []
            }

            if credits:
                credits = credits[:-1]

            for i in range(min(len(subjects), len(grades), len(credits))):

                semester["subjects"].append({

                    "course_name": subjects[i],

                    "grade": grades[i],

                    "credits": credits[i]

                })

            semesters.append(semester)

        return semesters
