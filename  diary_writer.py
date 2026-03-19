# diary_writer.py

import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_diary(keywords: str, emotion: str, highlight: str) -> str:
    from prompts import build_diary_prompt
    prompt = build_diary_prompt(keywords, emotion, highlight)

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "너는 감성적인 일기 작가야."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=700
    )
    return response.choices[0].message['content']
