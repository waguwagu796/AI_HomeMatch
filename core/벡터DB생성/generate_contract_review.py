from __future__ import annotations

from typing import Any, Dict, List

from retrieve_staged import retrieve_staged


def build_law_context(laws: List[Dict[str, Any]], max_chars: int = 1200) -> str:
    blocks: List[str] = []

    for i, h in enumerate(laws, start=1):
        m = h["meta"]
        header = f"[법령 {i}] {m.get('law_name')} {m.get('article')}"

        text = h["text"].strip()
        if len(text) > max_chars:
            text = text[:max_chars] + "\n...생략..."

        blocks.append(header + "\n" + text)

    return "\n\n".join(blocks)


def build_case_context(cases: List[Dict[str, Any]], max_chars: int = 800):

    blocks: List[str] = []

    for i, h in enumerate(cases, start=1):
        m = h["meta"]
        header = f"[사례 {i}] case_id={m.get('case_id')} | section={m.get('section')}"
        text = h["text"].strip()

        if len(text) > max_chars:
            text = text[:max_chars] + "\n...(생략)..."

        blocks.append(header + "\n" + text)

    return "\n\n".join(blocks)


def generate_contract_review(clause_text: str, model: str = "gemma3:4b") -> str:
    # 1️⃣ retrieve (법령 → 사례)
    retrieved = retrieve_staged(clause_text)

    law_ctx = build_law_context(retrieved["laws"])
    case_ctx = build_case_context(retrieved["cases"])

    system = """
        너는 주택임대차 계약서의 특약사항을 법적으로 검토하는 법률 검토 보조 AI다.

        규칙:
        1. 반드시 [법령 근거]를 1차 기준으로 삼아 검토한다.
        2. [사례 근거]는 법령 해석을 보조하는 참고 자료로만 사용한다.
        3. 근거에 없는 판단이나 추측은 절대 하지 않는다.
        4. 근거가 부족한 경우에는 반드시 "근거 부족"이라고 명시한다.
        5. 판결문이나 판례가 아닌 경우, 판결과 동일한 효력을 단정하지 않는다.

        출력 형식:
        - 검토 대상 특약
        - 관련 법령 검토
        - 사례 참고
        - 종합 의견
    """

    user = f"""
    [검토 대상 특약]
    {clause_text}

    [법령 근거]
    {law_ctx}

    [사례 근거]
    {case_ctx}
    """.strip()

    import ollama

    resp = ollama.chat(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        options={
            "temperature": 0.0,
            "num_predict": 500,
        },
    )

    return resp["message"]["content"]


if __name__ == "__main__":
    while True:
        clause = input("\n특약사항 입력 (종료: q): ").strip()
        if not clause:
            continue
        if clause.lower() == "q":
            break

        result = generate_contract_review(clause)
        print("\n========== CONTRACT REVIEW ==========")
        print(result)
