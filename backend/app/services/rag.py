"""
RAG (Retrieval-Augmented Generation) service using Qdrant Cloud
"""

from pathlib import Path
from typing import List, Dict
from app.config import settings
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.http.exceptions import UnexpectedResponse
import hashlib


# Supported collection names
COLLECTIONS = [
    "python_docs", "java_docs", "react_docs", "fastapi_docs",
    "cpp_docs", "javascript_docs", "owasp_docs", "clean_code_docs"
]

LANGUAGE_TO_COLLECTION = {
    "python": "python_docs",
    "java": "java_docs",
    "react": "react_docs",
    "fastapi": "fastapi_docs",
    "cpp": "cpp_docs",
    "javascript": "javascript_docs",
    "owasp": "owasp_docs",
    "clean_code": "clean_code_docs",
}

# Simple text embedding using character n-gram hashing (no external model needed)
VECTOR_SIZE = 384


def simple_embed(text: str) -> List[float]:
    """
    Simple deterministic text embedding using hashing.
    Lightweight alternative to sentence-transformers.
    """
    import math
    vector = [0.0] * VECTOR_SIZE
    words = text.lower().split()
    for i, word in enumerate(words[:VECTOR_SIZE]):
        h = int(hashlib.md5(word.encode()).hexdigest(), 16)
        idx = h % VECTOR_SIZE
        vector[idx] += 1.0 / (i + 1)
    # Normalize
    magnitude = math.sqrt(sum(v ** 2 for v in vector)) or 1.0
    return [v / magnitude for v in vector]


class RAGService:
    """RAG service for knowledge base retrieval using Qdrant Cloud"""

    def __init__(self):
        """Initialize RAG service with Qdrant Cloud"""
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
        )
        self._ensure_collections()

    def _ensure_collections(self):
        """Create collections in Qdrant if they don't exist"""
        existing = {c.name for c in self.client.get_collections().collections}
        for name in COLLECTIONS:
            if name not in existing:
                self.client.create_collection(
                    collection_name=name,
                    vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
                )
                print(f"✅ Created Qdrant collection: {name}")

    def add_knowledge_base(self, language: str, documents: List[Dict]):
        """
        Add documents to Qdrant knowledge base

        Args:
            language: Programming language
            documents: List of documents with 'id', 'content', 'metadata'
        """
        collection_name = LANGUAGE_TO_COLLECTION.get(language, f"{language}_docs")

        # Ensure collection exists
        existing = {c.name for c in self.client.get_collections().collections}
        if collection_name not in existing:
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
            )
            LANGUAGE_TO_COLLECTION[language] = collection_name

        points = []
        for doc in documents:
            content = doc.get("content", "")
            doc_id = doc.get("id", str(id(doc)))
            # Use integer ID (hash of string ID)
            int_id = int(hashlib.md5(doc_id.encode()).hexdigest(), 16) % (2 ** 63)
            vector = simple_embed(content)
            points.append(PointStruct(
                id=int_id,
                vector=vector,
                payload={"content": content, "metadata": doc.get("metadata", {})}
            ))

        if points:
            self.client.upsert(collection_name=collection_name, points=points)

    def retrieve_context(self, language: str, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve relevant context documents from Qdrant

        Args:
            language: Programming language
            query: Query string
            top_k: Number of top results to retrieve

        Returns:
            List of relevant documents
        """
        collection_name = LANGUAGE_TO_COLLECTION.get(language)
        if not collection_name:
            return []

        try:
            query_vector = simple_embed(query)
            results = self.client.search(
                collection_name=collection_name,
                query_vector=query_vector,
                limit=top_k,
                with_payload=True,
            )

            documents = []
            for hit in results:
                payload = hit.payload or {}
                documents.append({
                    "content": payload.get("content", ""),
                    "distance": 1 - hit.score,  # convert similarity to distance
                    "metadata": payload.get("metadata", {})
                })
            return documents

        except Exception as e:
            print(f"Error retrieving context from Qdrant: {e}")
            return []

    def load_knowledge_base_files(self):
        """Load knowledge base markdown files into Qdrant"""
        kb_path = Path("./knowledge_base")

        if not kb_path.exists():
            print("ℹ️ No knowledge_base directory found, skipping RAG load.")
            return

        languages = ["python", "java", "cpp", "react", "fastapi", "javascript"]

        for language in languages:
            lang_path = kb_path / language
            if lang_path.exists():
                for file in lang_path.glob("*.md"):
                    with open(file, "r", encoding="utf-8") as f:
                        content = f.read()
                        self.add_knowledge_base(
                            language,
                            [{
                                "id": f"{language}_{file.stem}",
                                "content": content,
                                "metadata": {"filename": file.name, "language": language}
                            }]
                        )
                        print(f"📚 Loaded {file.name} into Qdrant ({language})")


# Global RAG service instance
rag_service = RAGService()
rag_service.load_knowledge_base_files()
