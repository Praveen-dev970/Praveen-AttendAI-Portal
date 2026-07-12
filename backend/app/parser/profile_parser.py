from bs4 import BeautifulSoup


class ProfileParser:

    @staticmethod
    def parse(html: str):

        soup = BeautifulSoup(html, "lxml")

        profile = {
            "name": "",
            "course": "",
            "branch": "",
            "semester": ""
        }

        rows = soup.find_all("tr")

        for row in rows:

            cols = row.find_all("td")

            texts = [c.get_text(" ", strip=True) for c in cols]

            for i, text in enumerate(texts):

                if text == "Name" and i + 2 < len(texts):
                    profile["name"] = texts[i + 2]

                elif text == "Course" and i + 2 < len(texts):
                    profile["course"] = texts[i + 2]

                elif text == "Branch" and i + 2 < len(texts):
                    profile["branch"] = texts[i + 2]

                elif text == "Semester" and i + 2 < len(texts):
                    profile["semester"] = texts[i + 2]

        return profile