import streamlit as st
from openai import OpenAI, AuthenticationError, RateLimitError, APIError

from config import (
    OPENAI_API_KEY,
    OPENAI_MODEL,
    APP_TITLE,
    APP_DESCRIPTION,
    logger,
)

# --- Page Config ---
st.set_page_config(page_title="감성 일기 생성기 (영어+한글)", page_icon="📝")

st.title(APP_TITLE)
st.markdown(APP_DESCRIPTION)


# --- API Key Check ---
if not OPENAI_API_KEY:
    st.error("⚠️ OPENAI_API_KEY가 설정되지 않았습니다. `.env` 파일을 확인해주세요.")
    logger.error("OPENAI_API_KEY is not set")
    st.stop()

client = OpenAI(api_key=OPENAI_API_KEY)


# --- Diary Generation ---
SYSTEM_PROMPT = "You are an emotional diary writer. Write calm, heartfelt diary entries in Notion style. Always include a 💡 Today's Thought section at the end."


def _call_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


def generate_diary(keywords: str, highlight: str) -> tuple[str, str]:
    english_diary = _call_llm(
        f"Write a diary entry in ENGLISH only.\n\nKeywords: {keywords}\nHighlight: {highlight}"
    )
    korean_diary = _call_llm(
        f"Write a diary entry in KOREAN only (한국어로만 작성).\n\nKeywords: {keywords}\nHighlight: {highlight}"
    )
    return english_diary.strip(), korean_diary.strip()


# --- UI ---
with st.form("diary_form"):
    keywords = st.text_input("🔑 오늘의 키워드 (예: nephew, birthday, Bing Su)", "")
    highlight = st.text_input(
        "🌟 오늘의 하이라이트 (예: Had dinner with nephew for their birthday)", ""
    )
    submitted = st.form_submit_button("📖 일기 생성하기")

if submitted:
    if not keywords or not highlight:
        st.warning("키워드와 하이라이트를 모두 입력해주세요.")
    else:
        with st.spinner("🧠 일기 생성 중..."):
            try:
                logger.info("Generating diary — keywords=%s", keywords)
                english_diary, korean_diary = generate_diary(keywords, highlight)
                logger.info("Diary generated")

                st.success("✅ 일기 생성 완료!")
                st.markdown("### 🇺🇸 영어 일기")
                st.markdown(english_diary)
                st.markdown("---")
                st.markdown("### 🇰🇷 한국어 일기")
                st.markdown(korean_diary)

            except AuthenticationError:
                logger.error("Invalid OPENAI_API_KEY")
                st.error("API 키가 유효하지 않습니다. `.env` 파일을 확인해주세요.")
            except RateLimitError:
                logger.error("OpenAI API rate limit exceeded")
                st.error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.")
            except APIError as e:
                logger.error("OpenAI API error: %s", e)
                st.error(f"OpenAI API 오류: {e}")
            except Exception as e:
                logger.error("Unexpected error during diary generation: %s", e)
                st.error(f"일기 생성 중 오류 발생: {e}")
