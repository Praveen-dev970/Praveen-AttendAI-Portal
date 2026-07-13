import requests
import json
import re

from bs4 import BeautifulSoup
from app.utils.crypto import encrypt_password


class AECAuthenticationError(Exception):
    """Raised when the AEC portal rejects a student's credentials."""


class AECClient:

    BASE_URL = "https://info.aec.edu.in/aec"

    def __init__(self):

        self.session = requests.Session()

        self.session.headers.update(
            {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "(KHTML, like Gecko) "
                    "Chrome/138.0 Safari/537.36",

                "Origin":
                    "https://info.aec.edu.in",

                "Accept":
                    "text/html,application/xhtml+xml,"
                    "application/xml;q=0.9,*/*;q=0.8"
            }
        )
    def get_student_master(self):
        url = "https://info.aec.edu.in/aec/StudentMaster.aspx"
        response = self.session.get(url)
        response.raise_for_status()
        return response.text

    def get_student_profile(self, roll_number: str):
        url = (
            f"{self.BASE_URL}/ajax/"
            "StudentProfile,App_Web_studentprofile.aspx.a2a1b31c.ashx"
        )

        data = {
            "_method": "ShowStudentProfileNew",
            "_session": "rw",
            "RollNo": roll_number,
            "isImageDisplay": "false",
        }

        response = self.session.post(url, data=data)
        response.raise_for_status()
        return response.text
        
        def get_student_profile_page(self):
            url = f"{self.BASE_URL}/Academics/StudentProfile.aspx?scrid=17"
            response = self.session.get(url)
            response.raise_for_status()
            return response.text

    def _get_login_page(self):

        response = self.session.get(
            f"{self.BASE_URL}/default.aspx"
        )

        response.raise_for_status()

        return response.text

    def _extract_hidden_fields(self, html):

        soup = BeautifulSoup(html, "lxml")

        return {

            "__VIEWSTATE":
                soup.find(id="__VIEWSTATE")["value"],

            "__VIEWSTATEGENERATOR":
                soup.find(id="__VIEWSTATEGENERATOR")["value"],

            "__EVENTVALIDATION":
                soup.find(id="__EVENTVALIDATION")["value"],

            "hdnDPToken":
                soup.find(id="hdnDPToken")["value"]

        }

    def login(self, roll_number: str, password: str):

        html = self._get_login_page()

        hidden = self._extract_hidden_fields(html)

        encrypted = encrypt_password(password)

        payload = {

            "__VIEWSTATE":
                hidden["__VIEWSTATE"],

            "__VIEWSTATEGENERATOR":
                hidden["__VIEWSTATEGENERATOR"],

            "__VIEWSTATEENCRYPTED":
                "",

            "__EVENTVALIDATION":
                hidden["__EVENTVALIDATION"],

            "txtId2":
                roll_number,

            "txtPwd2":
                encrypted,

            "hdnpwd2":
                encrypted,

            "hdnDPToken":
                hidden["hdnDPToken"],

            "imgBtn2.x":
                "41",

            "imgBtn2.y":
                "24"

        }

        response = self.session.post(

            f"{self.BASE_URL}/default.aspx",

            data=payload,

            allow_redirects=False

        )

        if response.status_code != 302:
            raise AECAuthenticationError("Invalid Roll Number or Password")

        return True


    def get_attendance(self):

        attendance_page = f"{self.BASE_URL}/Academics/studentattendance.aspx"

        # Open attendance page first (required by ASP.NET)
        self.session.get(
            attendance_page,
            headers={
                "Referer": f"{self.BASE_URL}/StudentMaster.aspx"
            }
        )

        payload = {
            "fromDate": "",
            "toDate": "",
            "excludeothersubjects": False
        }

        response = self.session.post(
            f"{self.BASE_URL}/Academics/studentattendance.aspx/ShowAttendance",
            json=payload,
            headers={
                "Content-Type": "application/json; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": attendance_page
            }
        )

        return response.text


    def get_marks(self):

        marks_page = (
            f"{self.BASE_URL}/Academics/StudentMarksReport.aspx"
        )

        page = self.session.get(
            marks_page,
            headers={
                "Referer":
                f"{self.BASE_URL}/StudentMaster.aspx"
            }
        )

        page.raise_for_status()

        match = re.search(
            r'Academics_StudentMarksReport,App_Web_studentmarksreport\.aspx\.[A-Za-z0-9]+\.ashx',
            page.text,
            re.IGNORECASE
        )

        if not match:
            raise Exception("Unable to locate Marks endpoint.")

        ashx = match.group(0)

        response = self.session.post(

            f"{self.BASE_URL}/ajax/{ashx}?_method=ShowMarks&_session=rw",

            data="",

            headers={

                "Content-Type":
                "text/plain;charset=UTF-8",

                "Referer":
                marks_page

            }

        )

        #("Marks Response:", response.status_code)

        return response.text
