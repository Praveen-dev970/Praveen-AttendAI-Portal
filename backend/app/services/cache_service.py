from cachetools import TTLCache

CACHE_TTL = 120  # seconds
CACHE_SIZE = 100

dashboard_cache = TTLCache(maxsize=CACHE_SIZE, ttl=CACHE_TTL)
attendance_cache = TTLCache(maxsize=CACHE_SIZE, ttl=CACHE_TTL)
marks_cache = TTLCache(maxsize=CACHE_SIZE, ttl=CACHE_TTL)


class CacheService:

    # Dashboard
    @staticmethod
    def get_dashboard(roll_number: str):
        return dashboard_cache.get(roll_number)

    @staticmethod
    def set_dashboard(roll_number: str, data):
        dashboard_cache[roll_number] = data

    # Attendance
    @staticmethod
    def get_attendance(roll_number: str):
        return attendance_cache.get(roll_number)

    @staticmethod
    def set_attendance(roll_number: str, data):
        attendance_cache[roll_number] = data

    # Marks
    @staticmethod
    def get_marks(roll_number: str):
        return marks_cache.get(roll_number)

    @staticmethod
    def set_marks(roll_number: str, data):
        marks_cache[roll_number] = data

    @staticmethod
    def clear_student_cache(roll_number: str):
        dashboard_cache.pop(roll_number, None)
        attendance_cache.pop(roll_number, None)
        marks_cache.pop(roll_number, None)