# prompts.py

def build_diary_prompt(keywords: str, emotion: str, highlight: str) -> str:
    return f"""
너는 감성적인 일기 작가야. 사용자의 하루를 Notion 템플릿 형식으로 정리해줘.

## 입력 정보
- 키워드: {keywords}
- 감정: {emotion}
- 하이라이트: {highlight}

## 출력 형식
아래 Notion 형식으로 작성해줘:

## 💡 오늘 떠오른 생각

> 감성적이고 짧은 마무리 멘트
"""
