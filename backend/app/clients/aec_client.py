import logging
import re

import requests
from bs4 import BeautifulSoup

from app.utils.crypto import encrypt_password

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT = 30
MAX_REQUEST_ATTEMPTS = 2


class AECAuthenticationError(Exception):
    """Raised when the AEC portal rejects a student's credentials."""


class AECPortalError(Exception):
    """Base exception for AEC portal communication failures."""


class AECPortalTimeoutError(AECPortalError):
    """Raised when the AEC portal does not respond before the timeout."""


class AECPortalUnavailableError(AECPortalError):
    """Raised when the AEC portal cannot be reached or is unavailable."""


class AECSessionExpiredError(AECPortalError):
    """Raised when the portal rejects an authenticated session."""


class AECClient:
    BASE_URL = "https://info.aec.edu.in/aec"

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/138.0 Safari/537.36"
                ),
                "Origin": "https://info.aec.edu.in",
                "Accept": (
                    "text/html,application/xhtml+xml,"
                    "application/xml;q=0.9,*/*;q=0.8"
                ),
            }
        )

    def _request(self, method: str, url: str, **kwargs) -> requests.Response:
        request = self.session.get if method == "GET" else self.session.post
        last_exception: requests.RequestException | None = None

        for attempt in range(1, MAX_REQUEST_ATTEMPTS + 1):
            try:
                response = request(url, timeout=REQUEST_TIMEOUT, **kwargs)
                response.raise_for_status()
                return response
            except requests.Timeout as exc:
                last_exception = exc
                error = AECPortalTimeoutError("AEC portal request timed out.")
                logger.warning(
                    "AEC portal request timed out (attempt %s/%s)",
                    attempt,
                    MAX_REQUEST_ATTEMPTS,
                )
            except requests.ConnectionError as exc:
                last_exception = exc
                error = AECPortalUnavailableError("AEC portal is unavailable.")
                logger.warning(
                    "AEC portal connection failed (attempt %s/%s)",
                    attempt,
                    MAX_REQUEST_ATTEMPTS,
                )
            except requests.HTTPError as exc:
                last_exception = exc
                status_code = exc.response.status_code if exc.response is not None else None
                if status_code in {401, 403}:
                    raise AECSessionExpiredError("AEC portal session expired.") from exc
                if status_code is None or status_code < 500:
                    raise AECPortalUnavailableError("AEC portal is unavailable.") from exc

                error = AECPortalUnavailableError("AEC portal is unavailable.")
                logger.warning(
                    "AEC portal returned a temporary server error (attempt %s/%s)",
                    attempt,
                    MAX_REQUEST_ATTEMPTS,
                )
            except requests.RequestException as exc:
                last_exception = exc
                error = AECPortalUnavailableError("AEC portal is unavailable.")
                logger.warning(
                    "AEC portal network request failed (attempt %s/%s)",
                    attempt,
                    MAX_REQUEST_ATTEMPTS,
                )

            if attempt == MAX_REQUEST_ATTEMPTS:
                logger.error("AEC portal request failed after %s attempts", attempt)
                raise error from last_exception

        raise AECPortalUnavailableError("AEC portal is unavailable.")

    def get_student_master(self):
        response = self._request("GET", f"{self.BASE_URL}/StudentMaster.aspx")
        return response.text

    def get_student_profile(self, roll_number: str):
        url = (
            f"{self.BASE_URL}/ajax/"
            "StudentProfile,App_Web_studentprofile.aspx.a2a1b31c.ashx"
        )

        params = {
            "_method": "ShowStudentProfileNew",
            "_session": "rw",
        }

        headers = {
            "Accept": "*/*",
            "Content-Type": "text/plain;charset=UTF-8",
            "Referer": f"{self.BASE_URL}/Academics/StudentProfile.aspx?scrid=17",
            "Origin": "https://info.aec.edu.in",
        }

        body = (
            f"RollNo={roll_number}\r\n\r\n"
            "isImageDisplay=false"
        )

        response = self._request(
            "POST",
            url,
            params=params,
            headers=headers,
            data=body,
        )

        return response.text

    def _get_login_page(self):
        response = self._request("GET", f"{self.BASE_URL}/default.aspx")
        return response.text

    def _extract_hidden_fields(self, html):
        soup = BeautifulSoup(html, "lxml")
        return {
            "__VIEWSTATE": soup.find(id="__VIEWSTATE")["value"],
            "__VIEWSTATEGENERATOR": soup.find(id="__VIEWSTATEGENERATOR")["value"],
            "__EVENTVALIDATION": soup.find(id="__EVENTVALIDATION")["value"],
            "hdnDPToken": soup.find(id="hdnDPToken")["value"],
        }

    def login(self, roll_number: str, password: str):
        hidden = self._extract_hidden_fields(self._get_login_page())
        encrypted = encrypt_password(password)
        payload = {
            "__VIEWSTATE": hidden["__VIEWSTATE"],
            "__VIEWSTATEGENERATOR": hidden["__VIEWSTATEGENERATOR"],
            "__VIEWSTATEENCRYPTED": "",
            "__EVENTVALIDATION": hidden["__EVENTVALIDATION"],
            "txtId2": roll_number,
            "txtPwd2": encrypted,
            "hdnpwd2": encrypted,
            "hdnDPToken": hidden["hdnDPToken"],
            "imgBtn2.x": "41",
            "imgBtn2.y": "24",
        }
        response = self._request(
            "POST",
            f"{self.BASE_URL}/default.aspx",
            data=payload,
            allow_redirects=False,
        )

        if response.status_code != 302:
            raise AECAuthenticationError("Invalid Roll Number or Password")

        logger.info("AEC portal login succeeded")
        return True

    def get_attendance(self, from_date: str = "", to_date: str = "") -> str:
        attendance_page = f"{self.BASE_URL}/Academics/studentattendance.aspx"
        self._request(
            "GET",
            attendance_page,
            headers={"Referer": f"{self.BASE_URL}/StudentMaster.aspx"},
        )
        response = self._request(
            "POST",
            f"{attendance_page}/ShowAttendance",
            json={
                "fromDate": from_date,
                "toDate": to_date,
                "excludeothersubjects": False,
            },
            headers={
                "Content-Type": "application/json; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": attendance_page,
            },
        )
        return response.text

    def get_marks(self):
        marks_page = f"{self.BASE_URL}/Academics/StudentMarksReport.aspx"
        page = self._request(
            "GET",
            marks_page,
            headers={"Referer": f"{self.BASE_URL}/StudentMaster.aspx"},
        )
        match = re.search(
            r"Academics_StudentMarksReport,App_Web_studentmarksreport\.aspx\.[A-Za-z0-9]+\.ashx",
            page.text,
            re.IGNORECASE,
        )
        if not match:
            raise AECPortalUnavailableError("AEC marks service is unavailable.")

        response = self._request(
            "POST",
            f"{self.BASE_URL}/ajax/{match.group(0)}?_method=ShowMarks&_session=rw",
            data="",
            headers={
                "Content-Type": "text/plain;charset=UTF-8",
                "Referer": marks_page,
            },
        )
        return response.text
