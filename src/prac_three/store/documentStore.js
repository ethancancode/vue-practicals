import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useDocumentStore = defineStore('documentStore', {
  state: () => ({
    documents: [],
    currentDocument: null
  }),
  actions: {
    async fetchDocuments() {
      try {
        const response = await axios.get(`${API_URL}/documents`);
        this.documents = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async uploadDocument(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.documents.unshift(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteDocument(id) {
      try {
        await axios.delete(`${API_URL}/documents/${id}`);
        this.documents = this.documents.filter(doc => doc.id !== id);
        if (this.currentDocument && this.currentDocument.id === id) {
          this.currentDocument = null;
        }
      } catch (error) {
        console.error(error);
      }
    },
    selectDocument(doc) {
      this.currentDocument = doc;
    }
  }
});
