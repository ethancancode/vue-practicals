<script setup>
import { ref, onMounted } from 'vue';
import { useDocumentStore } from './store/documentStore';

const store = useDocumentStore();
const fileInput = ref(null);

onMounted(() => {
  store.fetchDocuments();
});

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  await store.uploadDocument(file);
  if (fileInput.value) fileInput.value.value = '';
};
</script>

<template>
  <div class="prac-three-body">
    <div class="app-container">
      
      <div class="main-layout">
        <div class="left-panel">
          <div class="card">
            <h3>Upload Document</h3>
            <input type="file" @change="handleFileSelect" ref="fileInput" />
          </div>

          <div class="card">
            <h3>Your Documents</h3>
            <p v-if="store.documents.length === 0">No documents found.</p>
            <ul class="doc-list">
              <li v-for="doc in store.documents" :key="doc.id" :class="{ active: store.currentDocument?.id === doc.id }">
                <span @click="store.selectDocument(doc)" class="doc-name">
                  {{ doc.filename }} <small>({{ (doc.size / 1024).toFixed(1) }} KB)</small>
                </span>
                <button @click.stop="store.deleteDocument(doc.id)" class="btn-delete">Delete</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="right-panel card">
          <h3>Document Preview</h3>
          <div v-if="store.currentDocument" class="preview-box">
            <h4>{{ store.currentDocument.filename }}</h4>
            
            <div v-if="store.currentDocument.filetype === 'application/pdf'" class="pdf-container">
              <iframe :src="'http://localhost:5000' + store.currentDocument.filepath" width="100%" height="500px"></iframe>
            </div>
            
            <div v-else class="generic-container">
              <p><strong>Type:</strong> {{ store.currentDocument.filetype }}</p>
              <p><strong>Uploaded:</strong> {{ new Date(store.currentDocument.upload_date).toLocaleString() }}</p>
              <a :href="'http://localhost:5000' + store.currentDocument.filepath" target="_blank" class="btn-download">
                Download & Open File
              </a>
            </div>
          </div>
          <p v-else class="placeholder-text">Select a document from the list to view its contents.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prac-three-body {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 40px 20px;
  font-family: system-ui, sans-serif;
  color: #333;
}
.app-container { max-width: 800px; margin: 0 auto; }
.main-layout { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
.card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px; }
.doc-list { list-style: none; padding: 0; margin: 0; }
.doc-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; border-radius: 4px; }
.doc-list li:hover { background: #f8f9fa; }
.doc-list li.active { background: #e3f2fd; border-left: 4px solid #1976d2; }
.doc-name { flex-grow: 1; }
button { background: #1976d2; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
button:disabled { background: #ccc; }
.btn-delete { background: #d32f2f; font-size: 12px; padding: 5px 8px; }
.btn-download { display: inline-block; background: #388e3c; color: white; padding: 10px 15px; border-radius: 4px; text-decoration: none; margin-top: 10px; }
.placeholder-text { color: #888; font-style: italic; text-align: center; margin-top: 40px; }
iframe { border: 1px solid #ddd; border-radius: 4px; }
</style>
