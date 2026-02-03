# law_ingest.py
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Dict, List, Sequence, Tuple

import pymysql


@dataclass(frozen=True)
class MySQLConfig:
    host: str
    port: int
    user: str
    password: str
    db: str
    charset: str = "utf8mb4"


def load_law_json_array(json_path: str) -> List[Dict[str, Any]]:
    """
    JSON 파일은 반드시 배열([])이어야 함.
    각 원소는 source_year/source_name/source_doc/page_start/page_end/title/text 포함.
    """
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("법령 JSON은 배열([]) 형식이어야 합니다.")

    return data


def to_rows(items: Sequence[Dict[str, Any]]) -> List[Tuple]:
    rows: List[Tuple] = []
    for it in items:
        # 이미지 원문 전사값을 그대로 쓰되, DB 타입(INT) 맞추기만 함
        rows.append(
            (
                int(it.get("source_year", 0)),
                str(it.get("source_name", "")),
                str(it.get("source_doc", "")),
                int(it.get("page_start", 0)),
                int(it.get("page_end", 0)),
                str(it.get("title", "")),
                str(it.get("text", "")),
            )
        )
    return rows


UPSERT_SQL = """
INSERT INTO law_text
(source_year, source_name, source_doc, page_start, page_end, title, text)
VALUES
(%s, %s, %s, %s, %s, %s, %s)
ON DUPLICATE KEY UPDATE
  source_year = VALUES(source_year),
  source_name = VALUES(source_name),
  text = VALUES(text),
  updated_at = CURRENT_TIMESTAMP
"""


def upsert_law_text(
    mysql_cfg: MySQLConfig,
    rows: Sequence[Tuple],
    batch_size: int = 500,
) -> int:
    """
    rows: (source_year, source_name, source_doc, page_start, page_end, title, text)
    return: 처리(시도)한 총 row 수
    """
    if not rows:
        return 0

    conn = pymysql.connect(
        host=mysql_cfg.host,
        port=mysql_cfg.port,
        user=mysql_cfg.user,
        password=mysql_cfg.password,
        database=mysql_cfg.db,
        charset=mysql_cfg.charset,
        autocommit=False,
    )

    try:
        with conn.cursor() as cur:
            total = 0
            for i in range(0, len(rows), batch_size):
                batch = rows[i : i + batch_size]
                cur.executemany(UPSERT_SQL, batch)
                total += len(batch)

        conn.commit()
        return total

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


def ingest_law_json_to_db(
    json_path: str,
    mysql_cfg: MySQLConfig,
    batch_size: int = 500,
) -> int:
    items = load_law_json_array(json_path)
    rows = to_rows(items)

    # 최소한의 데이터 검증(비어있으면 DB 에러 날 것들만)
    for idx, r in enumerate(rows):
        source_year, source_name, source_doc, page_start, page_end, title, text = r
        if not source_doc or not title or not text:
            raise ValueError(
                f"필수값 누락: index={idx}, source_doc/title/text 중 빈 값이 있습니다."
            )

    return upsert_law_text(mysql_cfg, rows, batch_size=batch_size)


if __name__ == "__main__":
    # ✅ 여기만 네 환경에 맞게 채우면 바로 실행 가능
    cfg = MySQLConfig(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="admin",
        db="final",
    )

    # 예: "housing_lease_law.json"
    json_path = "../json/2026_주택임대차보호법_json.txt"

    n = ingest_law_json_to_db(json_path, cfg, batch_size=500)
    print(f"OK: upserted {n} rows into law_text")
