# app.py

# import streamlit as st
# from diary_writer import generate_diary

# st.title("📝 LLM 일기 자동 생성기")

# with st.form("diary_form"):
#     keywords = st.text_input("오늘의 키워드 (쉼표로 구분)", "커피, 친구, 피곤함")
#     emotion = st.selectbox("오늘의 감정", ["😊 행복함", "😐 평범함", "😢 우울함", "😠 짜증남"])
#     highlight = st.text_input("가장 기억에 남는 일", "오랜만에 친구와 커피 마심")
#     submitted = st.form_submit_button("일기 생성하기")

# if submitted:
#     with st.spinner("일기 생성 중..."):
#         result = generate_diary(keywords, emotion, highlight)
#         st.markdown("### ✨ 생성된 일기")
#         st.markdown(result)


import streamlit as st
import requests
from googletrans import Translator

st.set_page_config(page_title="감성 일기 생성기 (영어+한글)", page_icon="📝")

st.title("📝 감성 일기 자동 생성기 (영어 + 한글)")
st.markdown("llama3 모델과 번역기를 이용해 오늘의 일기를 영어와 한글로 동시에 생성합니다.")

with st.form("diary_form"):
    keywords = st.text_input("🔑 오늘의 키워드 (예: nephew, birthday, Bing Su)", "")
    highlight = st.text_input("🌟 오늘의 하이라이트 (예: Had dinner with nephew for their birthday)", "")
    submitted = st.form_submit_button("📖 일기 생성하기")

if submitted:
    if not keywords or not highlight:
        st.warning("키워드와 하이라이트를 모두 입력해주세요.")
    else:
        with st.spinner("🧠 일기 생성 중..."):
            prompt = f"""
Write a calm and emotional diary in Notion style based on:

- Keywords: {keywords}
- Highlight: {highlight}

Sections:
- 💡 Today's Thought
"""

            try:
                # llama3 모델 호출
                response = requests.post(
                    "http://localhost:11434/api/generate",
                    json={"model": "llama3", "prompt": prompt, "stream": False}
                )
                english_diary = response.json()["response"]

                # 한국어 번역
                translator = Translator()
                translated = translator.translate(english_diary, src="en", dest="ko")
                korean_diary = translated.text

                # 결과 출력
                st.success("✅ 일기 생성 완료!")
                st.markdown("### 🇺🇸 영어 일기")
                st.markdown(english_diary)
                st.markdown("---")
                st.markdown("### 🇰🇷 한국어 번역 일기")
                st.markdown(korean_diary)

            except Exception as e:
                st.error(f"일기 생성 중 오류 발생: {e}")
