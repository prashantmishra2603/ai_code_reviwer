"""
RAG (Retrieval-Augmented Generation) service using ChromaDB
"""

import chromadb
from pathlib import Path
from typing import List, Dict
from app.config import settings
import os


class RAGService:
    """RAG service for knowledge base retrieval"""
    
    def __init__(self):
        """Initialize RAG service with ChromaDB"""
        # Ensure vector DB path exists
        Path(settings.chroma_db_path).mkdir(parents=True, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=settings.chroma_db_path
        )
        
        # Get or create collections for different documentation
        self.collections = {
            "python": self.client.get_or_create_collection(name="python_docs"),
            "java": self.client.get_or_create_collection(name="java_docs"),
            "react": self.client.get_or_create_collection(name="react_docs"),
            "fastapi": self.client.get_or_create_collection(name="fastapi_docs"),
            "cpp": self.client.get_or_create_collection(name="cpp_docs"),
            "javascript": self.client.get_or_create_collection(name="javascript_docs"),
            "owasp": self.client.get_or_create_collection(name="owasp_docs"),
            "clean_code": self.client.get_or_create_collection(name="clean_code_docs"),
        }
    
    def add_knowledge_base(self, language: str, documents: List[Dict]):
        """
        Add documents to knowledge base
        
        Args:
            language: Programming language
            documents: List of documents with 'id', 'content', 'metadata'
        """
        if language not in self.collections:
            self.collections[language] = self.client.get_or_create_collection(
                name=f"{language}_docs"
            )
        
        collection = self.collections[language]
        
        for doc in documents:
            collection.add(
                ids=[doc.get("id", str(id(doc)))],
                documents=[doc.get("content", "")],
                metadatas=[doc.get("metadata", {})],
            )
    
    def retrieve_context(self, language: str, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve relevant context documents
        
        Args:
            language: Programming language
            query: Query string
            top_k: Number of top results to retrieve
            
        Returns:
            List of relevant documents
        """
        if language not in self.collections:
            return []
        
        collection = self.collections[language]
        
        try:
            results = collection.query(
                query_texts=[query],
                n_results=top_k
            )
            
            # Format results
            documents = []
            if results and results.get("documents"):
                for i, doc in enumerate(results["documents"][0]):
                    documents.append({
                        "content": doc,
                        "distance": results.get("distances", [[]])[0][i] if results.get("distances") else 0,
                        "metadata": results.get("metadatas", [[]])[0][i] if results.get("metadatas") else {}
                    })
            
            return documents
        except Exception as e:
            print(f"Error retrieving context: {e}")
            return []
    
    def load_knowledge_base_files(self):
        """Load knowledge base from files"""
        kb_path = Path(settings.chroma_db_path) / "../knowledge_base"
        
        if not kb_path.exists():
            return
        
        # Load different documentation files
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


# Global RAG service instance
rag_service = RAGService()
rag_service.load_knowledge_base_files()
