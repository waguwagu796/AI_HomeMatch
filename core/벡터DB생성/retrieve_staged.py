# retrieve_staged.py
from __future__ import annotations

from typing import Any, Dict, List

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

from config import RAG


def get_law_collection():
    client = chromadb.PersistentClient(
        path=str(RAG.chroma_dir),
        settings=Settings(anonymized_telemetry=False),
    )
    return client.get_or_create_collection(name=RAG.law_collection_name)


def get_case_collection():
    client = chromadb.PersistentClient(
        path=str(RAG.chroma_dir),
        settings=Settings(anonymized_telemetry=False),
    )
    return client.get_or_create_collection(name=RAG.mediation_collection_name)


def retrieve_staged(
    query: str,
    top_k_laws: int = 4,
    top_k_cases: int = 4,
) -> Dict[str, List[Dict[str, Any]]]:

    model = SentenceTransformer(RAG.embedding_model_name)
    q_emb = model.encode([query], normalize_embeddings=True).tolist()[0]

    # =========================
    # 1️⃣ 법령 먼저 검색
    # =========================
    law_col = get_law_collection()
    law_res = law_col.query(
        query_embeddings=[q_emb],
        n_results=top_k_laws,
        include=["documents", "metadatas", "distances"],
    )

    law_hits: List[Dict[str, Any]] = []
    for doc, meta, dist in zip(
        law_res["documents"][0],
        law_res["metadatas"][0],
        law_res["distances"][0],
    ):
        law_hits.append(
            {
                "source": "law",
                "text": doc,
                "meta": meta,
                "distance": float(dist),
            }
        )

    # =========================
    # 2️⃣ 사례 검색 (보조 근거)
    # =========================
    case_col = get_case_collection()
    case_res = case_col.query(
        query_embeddings=[q_emb],
        n_results=top_k_cases,
        include=["documents", "metadatas", "distances"],
    )

    case_hits: List[Dict[str, Any]] = []
    for doc, meta, dist in zip(
        case_res["documents"][0],
        case_res["metadatas"][0],
        case_res["distances"][0],
    ):
        case_hits.append(
            {
                "source": "case",
                "text": doc,
                "meta": meta,
                "distance": float(dist),
            }
        )

    return {
        "laws": law_hits,  # ⚖️ 기준
        "cases": case_hits,  # 📘 보조
    }


def preview_staged(result: Dict[str, List[Dict[str, Any]]], max_chars: int = 300):

    print("\n========== LAW (PRIMARY) ==========")
    for i, h in enumerate(result["laws"], start=1):
        m = h["meta"]
        print(
            f"[{i}] dist={h['distance']:.4f} | "
            f"{m.get('law_name')} {m.get('article')}"
        )
        print("  text:", h["text"][:max_chars].replace("\n", " "))
        print()

    print("\n========== CASE (SECONDARY) ==========")
    for i, h in enumerate(result["cases"], start=1):
        m = h["meta"]
        print(
            f"[{i}] dist={h['distance']:.4f} | "
            f"case_id={m.get('case_id')} | section={m.get('section')}"
        )
        print("  text:", h["text"][:max_chars].replace("\n", " "))
        print()


if __name__ == "__main__":
    while True:
        q = input("\n특약사항 입력 (종료: q): ").strip()
        if not q:
            continue
        if q.lower() == "q":
            break

        result = retrieve_staged(
            q,
            top_k_laws=RAG.top_k,
            top_k_cases=RAG.top_k,
        )

        preview_staged(result)
