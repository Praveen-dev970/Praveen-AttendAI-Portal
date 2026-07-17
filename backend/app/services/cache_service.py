from cachetools import TTLCache

CACHE_TTL = 120  # seconds
CACHE_SIZE = 100

dashboard_cache = TTLCache(maxsize=CACHE_SIZE, ttl=CACHE_TTL)


class CacheService:
    @staticmethod
    def get_dashboard(roll_number: str):
        return dashboard_cache.get(roll_number)

    @staticmethod
    def set_dashboard(roll_number: str, data: dict) -> None:
        dashboard_cache[roll_number] = data
