# build_law_vector_db.py
from __future__ import annotations

from typing import Any, Dict, List

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

from config import RAG, load_db_config
import pymysql


# -----------------------------
# DB → 법령 로드
# -----------------------------
def fetch_law_articles() -> List[Dict[str, Any]]:
    db = load_db_config()

    conn = pymysql.connect(
        host=db.host,
        port=db.port,
        user=db.user,
        password=db.password,
        database=db.database,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    id,
                    source_year,
                    source_name,
                    source_doc,
                    page_start,
                    page_end,
                    title,
                    text
                FROM law_text
                ORDER BY id
                """
            )
            return cur.fetchall()
    finally:
        conn.close()


# -----------------------------
# Chroma collection
# -----------------------------
def get_law_collection():
    client = chromadb.PersistentClient(
        path=str(RAG.chroma_dir),
        settings=Settings(anonymized_telemetry=False),
    )
    return client.get_or_create_collection(name=RAG.law_collection_name)


# -----------------------------
# Build vector DB
# -----------------------------
def build_law_vector_db():
    rows = fetch_law_articles()

    print(f"[INFO] law articles loaded: {len(rows)}")
    if not rows:
        print("[WARN] law_text 테이블이 비어있습니다.")
        return

    documents: List[str] = []
    metadatas: List[Dict[str, Any]] = []
    ids: List[str] = []

    for r in rows:
        doc_id = f"law:{r['id']}"

        documents.append(r["text"])

        metadatas.append(
            {
                "source_type": "law",
                "law_name": r["source_name"],
                "article": r["title"],
                "source_year": r["source_year"],
                "source_doc": r["source_doc"],
                "page_start": r["page_start"],
                "page_end": r["page_end"],
            }
        )

        ids.append(doc_id)

    model = SentenceTransformer(RAG.embedding_model_name)

    embeddings = model.encode(
        documents,
        normalize_embeddings=True,
        show_progress_bar=True,
    )

    col = get_law_collection()
    col.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
        embeddings=embeddings,
    )

    print("[DONE] law vector DB build completed")
    print(f"[INFO] collection = {RAG.law_collection_name}")
    print(f"[INFO] stored at = {RAG.chroma_dir}")


if __name__ == "__main__":
    build_law_vector_db()
