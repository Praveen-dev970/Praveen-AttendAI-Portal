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

        tds = soup.find_all("td")

        for i, td in enumerate(tds):

            text = td.get_text(" ", strip=True)

            if text == "Name":
                profile["name"] = tds[i + 2].get_text(" ", strip=True)

            elif text == "Course":
                profile["course"] = tds[i + 2].get_text(" ", strip=True)

            elif text == "Branch":
                profile["branch"] = tds[i + 2].get_text(" ", strip=True)

            elif text == "Semester":
                profile["semester"] = (
                    tds[i + 2]
                    .get_text(" ", strip=True)
                    .replace("Regular(", "")
                    .replace(")", "")
                    .strip()
                )

        return profile