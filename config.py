import os
import logging
from dotenv import load_dotenv

load_dotenv()

# OpenAI API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# App
APP_TITLE = "📝 감성 일기 자동 생성기 (영어 + 한글)"
APP_DESCRIPTION = "ChatGPT 모델을 이용해 오늘의 일기를 영어와 한글로 동시에 생성합니다."
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("deardiary")
